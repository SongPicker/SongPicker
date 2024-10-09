import numpy as np
import pandas as pd
import random
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from django.shortcuts import render
from django.http import JsonResponse
from .models import Song, PersonalSingHistory, BaseData, TeamSingHistory
from django.forms.models import model_to_dict
from sklearn.neural_network import MLPRegressor
from scipy.sparse.linalg import svds

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def individual_recommend_songs_api(request):
    memberId = request.GET.get('memberId')
 
    # 해당 멤버의 history 데이터 가져오기
    sing_history = PersonalSingHistory.objects.filter(member_id=memberId)

    # 데이터 직렬화
    sing_history_list = [
        {
            'song_id': history.song_id,  # 필드명은 모델에 따라 다름
            'sing_at': history.sing_at,  # 필드명은 모델에 따라 다름
        }
        for history in sing_history
    ]

    base_data = BaseData.objects.filter(member_id=memberId)

    base_data_list = [
            {
                'song_id': data.song_id,
            }
            for data in base_data
        ]
    
    if len(sing_history_list) >= 10:
        recent_songs = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)[:10]
        
        # 최근 2곡 픽스
        fixed_songs = recent_songs[:2]

        # 남은 곡
        remaining_songs = recent_songs[2:]
        additional_songs = random.sample(remaining_songs, 3)
        
        choice_songs = fixed_songs + additional_songs
    elif len(sing_history_list) >= 3:
        recent_songs = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)

        # 최근 2곡 픽스
        fixed_songs = recent_songs[:2]

        # 남은 곡
        remaining_songs = recent_songs[2:] + base_data_list

        additional_songs = random.sample(remaining_songs, 3)
        
        choice_songs = fixed_songs + additional_songs
    else:
        # 최근 1곡 또는 2곡 픽스
        fixed_songs = sing_history_list

        # 베이스 데이터 중에 3곡 랜덤
        additional_songs = random.sample(base_data_list, 3)

        choice_songs = fixed_songs + additional_songs

    # song_ids 추출 (노래 ID 리스트)
    song_ids = [song['song_id'] for song in choice_songs]

    # 데이터 전처리
    df, df_encoded, X_scaled, features = preprocess_data()

    # #최근 5곡의 제목 출력 (디버깅용)
    # choice_songs_info = df[df['id'].isin(song_ids)][['id', 'title', 'singer']]
    # print("\n최근 5곡:")
    # print(choice_songs_info.to_string(index=False))
    # print()

    if len(song_ids) == 5:
        weights = [6, 5, 3, 3, 3]
    elif len(song_ids) == 4:
        weights = [7, 5, 4, 4]
    elif len(song_ids) == 3:
        weights = [8, 7, 7]

    index = 0
    recommended_songs = pd.DataFrame(columns=['id', 'acousticness', 'bpm', 'composer', 'cover_image', 'danceability', 
                                            'energy', 'genre', 'happiness', 'is_popular', 'lyricist', 'lyrics', 
                                            'number', 'released_at', 'singer', 'title', 'tune', 'tune_encoded'])

    for song_id in song_ids:
        # recommended_songs_by = get_recommendations_cosine(song_id, df, df_encoded, X_scaled, features)
        # recommended_songs_by = get_recommendations_mf(song_id, df, df_encoded, X_scaled, features)
        recommended_songs_by = get_recommendations_content(song_id, df, df_encoded, X_scaled, features)
        
        count = 0
        for _, song in recommended_songs_by.iterrows():
            if count >= weights[index]:
                break
            if song['id'] not in recommended_songs['id'].values:
                recommended_songs = pd.concat([recommended_songs, pd.DataFrame([song])], ignore_index=True)
                count += 1
        index += 1

    # 중복 제거 (혹시 모를 경우를 대비)
    recommended_songs = recommended_songs.drop_duplicates(subset='id')

    # DataFrame을 딕셔너리 리스트로 변환
    recommended_songs_list = recommended_songs[['id', 'number', 'title', 'singer']].to_dict('records')

    return Response(recommended_songs_list)


@api_view(['GET'])
def team_recommend_songs_api(request):
    teamId = request.GET.get('teamId')
 
    # 해당 멤버의 history 데이터 가져오기
    sing_history = TeamSingHistory.objects.filter(team_id=teamId)

    # 데이터 직렬화
    sing_history_list = [
        {
            'song_id': history.song_id,  # 필드명은 모델에 따라 다름
            'sing_at': history.sing_at,  # 필드명은 모델에 따라 다름
        }
        for history in sing_history
    ]

    if len(sing_history_list) == 0:
        return Response(None)

    if len(sing_history_list) >= 5:
        recent_songs = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)[:10]
        
        # 최근 2곡 픽스
        fixed_songs = recent_songs[:2]

        # 남은 곡
        remaining_songs = recent_songs[2:]
        additional_songs = random.sample(remaining_songs, 3)
        
        choice_songs = fixed_songs + additional_songs
    else:
        choice_songs = sing_history_list

    # song_ids 추출 (노래 ID 리스트)
    song_ids = [song['song_id'] for song in choice_songs]

    # 데이터 전처리
    df, df_encoded, X_scaled, features = preprocess_data()

    # #최근 5곡의 제목 출력 (디버깅용)
    # choice_songs_info = df[df['id'].isin(song_ids)][['id', 'title', 'singer']]
    # print("\n최근 5곡:")
    # print(choice_songs_info.to_string(index=False))
    # print()

    if len(song_ids) == 5:
        weights = [6, 5, 3, 3, 3]
    elif len(song_ids) == 4:
        weights = [7, 5, 4, 4]
    elif len(song_ids) == 3:
        weights = [8, 7, 7]
    elif len(song_ids) == 2:
        weights = [12, 8]
    else:
        weights = [20]

    index = 0
    recommended_songs = pd.DataFrame(columns=['id', 'acousticness', 'bpm', 'composer', 'cover_image', 'danceability', 
                                            'energy', 'genre', 'happiness', 'is_popular', 'lyricist', 'lyrics', 
                                            'number', 'released_at', 'singer', 'title', 'tune', 'tune_encoded'])

    for song_id in song_ids:
        # recommended_songs_by = get_recommendations_cosine(song_id, df, df_encoded, X_scaled, features)
        # recommended_songs_by = get_recommendations_mf(song_id, df, df_encoded, X_scaled, features)
        recommended_songs_by = get_recommendations_content(song_id, df, df_encoded, X_scaled, features)
        
        count = 0
        for _, song in recommended_songs_by.iterrows():
            if count >= weights[index]:
                break
            if song['id'] not in recommended_songs['id'].values:
                recommended_songs = pd.concat([recommended_songs, pd.DataFrame([song])], ignore_index=True)
                count += 1
        index += 1

    # 중복 제거 (혹시 모를 경우를 대비)
    recommended_songs = recommended_songs.drop_duplicates(subset='id')

    # DataFrame을 딕셔너리 리스트로 변환
    recommended_songs_list = recommended_songs[['id', 'number', 'title', 'singer']].to_dict('records')

    return Response(recommended_songs_list)

def preprocess_data():
    songs = Song.objects.all().values()

    df = pd.DataFrame.from_records(songs)

    # 결측값 해결 (비어 있는 값)
    # 결측값이 포함된 행 삭제
    df.dropna(inplace=True)
    
    # Tune 순서 정의 (플랫과 샵 포함)
    tune_order = [
        'C Major', 'C Minor', 'C# Major', 'C# Minor', 
        'D♭ Major', 'D♭ Minor', 'D Major', 'D Minor', 'D# Major', 'D# Minor', 
        'E♭ Major', 'E♭ Minor', 'E Major', 'E Minor',
        'F Major', 'F Minor', 'F# Major', 'F# Minor', 
        'G♭ Major', 'G♭ Minor', 'G Major', 'G Minor', 'G# Major', 'G# Minor', 
        'A♭ Major', 'A♭ Minor', 'A Major', 'A Minor', 'A# Major', 'A# Minor', 
        'B♭ Major', 'B♭ Minor', 'B Major', 'B Minor'
    ]

    # 동일음 처리 (예: C# = D♭)
    equivalent_tunes = {
        'C# Major': 'D♭ Major', 'C# Minor': 'D♭ Minor',
        'D# Major': 'E♭ Major', 'D# Minor': 'E♭ Minor',
        'F# Major': 'G♭ Major', 'F# Minor': 'G♭ Minor',
        'G# Major': 'A♭ Major', 'G# Minor': 'A♭ Minor',
        'A# Major': 'B♭ Major', 'A# Minor': 'B♭ Minor'
    }

    # 동일음을 기준으로 tune 컬럼을 업데이트
    df['tune'] = df['tune'].replace(equivalent_tunes)
    
    # Tune을 순서형 데이터로 변환
    tune_map = {tune: i+1 for i, tune in enumerate(tune_order)}
    df['tune_encoded'] = df['tune'].map(tune_map)
    
    # 나머지 특성 처리
    #원핫 인코딩
    df_encoded = pd.get_dummies(df, columns=['genre'])  # 'genre'
    df_encoded['release_year'] = pd.to_datetime(df_encoded['released_at']).dt.year # 'year'
    
    # 특성 선택
    # 원핫 인코딩된 'genre' 컬럼과 'release_year' 추가
    features = ['bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded', 'release_year']
    features += [col for col in df_encoded.columns if col.startswith('genre_')]
    
    X = df_encoded[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, df_encoded, X_scaled, features

# 장르랑 톤, 발매연도에 가중치 부여
def apply_feature_weights(X_scaled, features):
    genre_weight=2.0
    tune_weight=1.5
    year_weight=1.2
    weighted_X = X_scaled.copy()
    for i, feature in enumerate(features):
        if feature.startswith('genre_'):
            weighted_X[:, i] *= genre_weight
        elif feature == 'tune_encoded':
            weighted_X[:, i] *= tune_weight
        elif feature == 'release_year':
            weighted_X[:, i] *= year_weight
    return weighted_X

# 디버깅을 위한 출력 추가
def debug_data_shapes(df, df_encoded, X_scaled):
    print(f"df shape: {df.shape}")
    print(f"df_encoded shape: {df_encoded.shape}")
    print(f"X_scaled shape: {X_scaled.shape}")
    print(f"df_encoded columns: {df_encoded.columns.tolist()}")
    print(f"Number of genre columns: {len([col for col in df_encoded.columns if col.startswith('genre_')])}")
    print(f"'tune_encoded' in df_encoded: {'tune_encoded' in df_encoded.columns}")

def get_recommendations_cosine(song_id, df, df_encoded, X_scaled, features, n_recommendations=20):
    # 가중치 적용
    weighted_X = apply_feature_weights(X_scaled, features)
    input_indice = df_encoded[df_encoded['id'] == song_id].index
    # print(input_indices)

    # 입력된 곡들의 특성 벡터 추출
    input_features = weighted_X[input_indice]

    # 차원 확인
    # print("input_features shape:", input_features.shape)
    # print("weighted_X shape:", weighted_X.shape)

    # 모든 곡과의 코사인 유사도 계산
    similarities = cosine_similarity(input_features, weighted_X).flatten()

    # 유사도가 높은 순으로 정렬하고 입력된 곡들 제외
    similar_indices = similarities.argsort()[::-1]
    similar_indices = [idx for idx in similar_indices if idx not in input_indice]

    # 상위 n개의 추천 곡 선택
    top_n_indices = similar_indices[:n_recommendations]
    recommended_songs_cosine = df.iloc[top_n_indices]

    return recommended_songs_cosine


def get_recommendations_mf(song_id, df, df_encoded, X_scaled, features, n_factors=5, n_recommendations=20):
    # 가중치 적용
    weighted_X = apply_feature_weights(X_scaled, features)

    # SVD 수행
    U, sigma, Vt = svds(weighted_X, k=n_factors)

    # 특이값을 대각행렬로 변환
    sigma = np.diag(sigma)

    input_indice = df_encoded[df_encoded['id'] == song_id].index

    # 입력된 곡들의 잠재 요인 추출
    input_factor = U[input_indice, :] @ sigma

    # 모든 곡과의 유사도 계산
    all_song_factors = U @ sigma

    similarities = cosine_similarity(input_factor, all_song_factors).flatten()
    # print("유사도 범위:", similarities.min(), similarities.max())

    # 유사도가 높은 순으로 정렬하고 입력된 곡들 제외
    similar_indices = similarities.argsort()[::-1]
    similar_indices = [idx for idx in similar_indices if idx != input_indice]

    # 상위 n개의 추천 곡 선택
    top_n_indices = similar_indices[:n_recommendations]
    recommended_songs_mf = df.iloc[top_n_indices]

    return recommended_songs_mf

def get_recommendations_content(song_id, df, df_encoded, X_scaled, features, n_recommendations=20, n_factors=5, cosine_content_weight=0.6, mf_content_weight=0.3, random_weight=0.1):
    # 가중치 적용
    weighted_X = apply_feature_weights(X_scaled, features)
    input_indice = df_encoded[df_encoded['id'] == song_id].index

    input_features = weighted_X[input_indice]

    # 직접 콘텐츠 기반 추천 점수 계산
    cosine_content_scores = cosine_similarity(input_features, weighted_X).flatten()
    
    # 잠재 요인 기반 콘텐츠 추천 점수 계산
    U, sigma, Vt = svds(weighted_X, k=n_factors)
    sigma = np.diag(sigma)
    # 입력된 곡들의 잠재 요인 추출
    input_factor = U[input_indice, :] @ sigma
    mf_content_scores = cosine_similarity(input_factor, U @ sigma).flatten()

    # 랜덤 점수 생성
    random_scores = np.random.random(len(df))
    
    # 최종 점수 계산
    final_scores = (cosine_content_scores * cosine_content_weight + 
                    mf_content_scores * mf_content_weight + 
                    random_scores * random_weight)
    
    # 입력된 곡들 제외
    final_scores[input_indice] = -np.inf

    # 상위 n개의 추천 곡 선택
    top_n_indices = final_scores.argsort()[::-1][:n_recommendations]
    recommended_songs = df.iloc[top_n_indices]

    return recommended_songs