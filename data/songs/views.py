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

    # 최근 5곡을 선택하거나 base_data에서 데이터 가져오기
    if len(sing_history_list) >= 5:
        # sing_history에서 최근 5곡 가져오기
        recent_songs = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)[:5]
    else:
        # sing_history 전체 곡과 base_data에서 추가 곡 가져오기
        base_data = BaseData.objects.filter(member_id=memberId)
        
        # base_data 직렬화
        base_data_list = [
            {
                'song_id': data.song_id,
            }
            for data in base_data
        ]
        
        # sing_history와 base_data를 합쳐서 총 5곡이 되도록 선정
        recent_songs = sing_history_list + base_data_list

    # base_data에서 데이터 가져오기
    # base_data = BaseData.objects.filter(member_id=memberId)
    # base_data_list = [{'song_id': data.song_id} for data in base_data]

    # # 곡 선택 로직
    # if len(sing_history_list) == 0:
    #     # sing_history_list가 전혀 없고 5곡이 있는 경우
    #     if len(base_data_list) >= 5:
    #         recent_songs = random.sample(base_data_list, 5)
    #     else:
    #         recent_songs = base_data_list
    # elif len(sing_history_list) == 5:
    #     # sing_history_list가 전혀 없고 sing_history_list에 있는 곡이 5곡인 경우
    #     recent_songs = random.sample(sing_history_list, 3)
    # elif len(sing_history_list) >= 5:
    #     # sing_history_list가 5곡 이상일 경우
    #     recent_songs = random.sample(sing_history_list, 5)
    # elif len(sing_history_list) in [1, 2]:
    #     # sing_history_list가 1개 또는 2개일 경우
    #     needed_songs = 5 - len(sing_history_list)
    #     additional_songs = random.sample(base_data_list, min(needed_songs, len(base_data_list)))
    #     recent_songs = sing_history_list + additional_songs
    # elif 3 <= len(sing_history_list) < 10:
    #     # sing_history_list가 3개 이상 10개 미만일 경우
    #     sing_history_sorted = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)
    #     fixed_songs = sing_history_sorted[:2]
    #     remaining_choices = sing_history_sorted[2:] + base_data_list
    #     additional_songs = random.sample(remaining_choices, 5 - len(fixed_songs))
    #     recent_songs = fixed_songs + additional_songs
    # else:
    #     # sing_history_list가 10곡 이상일 경우
    #     sing_history_sorted = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)[:10]
    #     fixed_songs = sing_history_sorted[:2]
    #     remaining_choices = sing_history_sorted[2:]
    #     additional_songs = random.sample(remaining_choices, 3)
    #     recent_songs = fixed_songs + additional_songs

    # song_ids 추출 (노래 ID 리스트)
    song_ids = [song['song_id'] for song in recent_songs]

    # 데이터 전처리
    df, df_encoded, X_scaled = preprocess_data()

    recommended_songs = get_recommendations_cosine(song_ids, df, df_encoded, X_scaled)
    # recommended_songs = get_recommendations_mf(song_ids, df, df_encoded, X_scaled)

        
    # 추천 곡 리스트 직렬화
    recommended_songs_list = recommended_songs.to_dict('records')

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

    # 최근 5곡을 선택하거나 base_data에서 데이터 가져오기
    if len(sing_history_list) >= 5:
        # sing_history에서 최근 5곡 가져오기
        recent_songs = sorted(sing_history_list, key=lambda x: x['sing_at'], reverse=True)[:5]
    else:
        # sing_history
        recent_songs = sing_history_list

    # song_ids 추출 (노래 ID 리스트)
    song_ids = [song['song_id'] for song in recent_songs]

    # 데이터 전처리
    df, df_encoded, X_scaled = preprocess_data()

    recommended_songs = get_recommendations_cosine(song_ids, df, df_encoded, X_scaled)
        
    # 추천 곡 리스트 직렬화
    recommended_songs_list = recommended_songs.to_dict('records')

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
    df_encoded = pd.get_dummies(df, columns=['genre'])  # 'genre'만 원핫 인코딩
    # df_encoded['release_year'] = pd.to_datetime(df_encoded['released_at']).dt.year
    
    # 원핫 인코딩된 'genre' 컬럼과 'release_year' 추가
    features = ['bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded']
    features += [col for col in df_encoded.columns if col.startswith('genre_')]
    # features.append('release_year')
    
    X = df_encoded[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, df_encoded, X_scaled

def get_recommendations_cosine(song_ids, df, df_encoded, X_scaled, n_recommendations=20):
    indices = [df[df['id'] == song_id].index[0] for song_id in song_ids]
    avg_features = np.mean(X_scaled[indices], axis=0)

    filtered_songs = df_encoded[df_encoded['id'].isin(song_ids)]

    # 'genre_'로 시작하는 장르 칼럼들만 추출하여 장르 필터링 준비
    genre_columns = [col for col in df_encoded.columns if col.startswith('genre_')]
    filtered_genres = filtered_songs[genre_columns]

    # 각 행에서 True인 컬럼들만 가져와서 새로운 데이터프레임에 저장
    # 새로운 데이터프레임을 생성하기 위해 빈 리스트 초기화
    genre_filtered_rows = []

    # True가 있는 장르들만 해당 row의 song_id와 함께 저장
    for index, row in filtered_genres.iterrows():
        # True인 장르 필드만 선택
        true_genres = row[row == True].index.tolist()
        # song_id 가져오기
        song_id = filtered_songs.loc[index, 'id']
        # 노래 ID와 장르 리스트를 딕셔너리로 묶어서 저장
        genre_filtered_rows.append({'song_id': song_id, 'genres': true_genres})

    # 새로운 데이터프레임 생성
    genre_filtered_df = pd.DataFrame(genre_filtered_rows)

    # 'bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded' 컬럼 리스트
    features_columns = ['id','bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded']

    # 장르 관련 컬럼 추가
    genre_columns = [col for col in df_encoded.columns if col.startswith('genre_')]

    # 최종적으로 남길 컬럼 리스트
    final_columns = features_columns + genre_columns

    # 필요한 컬럼만 선택하여 새로운 DataFrame 생성
    df_filtered = df_encoded[final_columns]

    # 장르별 그룹화 전에 리스트를 문자열로 변환
    genre_filtered_df['genres_str'] = genre_filtered_df['genres'].apply(lambda x: ','.join(x))

    # 장르별로 그룹화
    grouped_genre_df = genre_filtered_df.groupby('genres_str')['song_id'].apply(list).reset_index()

    # 결과 저장할 리스트 초기화
    grouped_features = []

    # 각 장르 그룹에 대해 특성 가져오기
    for _, row in grouped_genre_df.iterrows():
        genre_str = row['genres_str']
        song_ids = row['song_id']
        # df_filtered에서 song_id가 일치하는 행 필터링
        matched_songs = df_filtered[df_filtered['id'].isin(song_ids)]
        # 필요한 특성 가져오기
        features = matched_songs[['id', 'bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded']]
        grouped_features.append({'genres': genre_str, 'features': features})

    genre_avg_features = {}

    for data in grouped_features:
        # 각 장르에 속하는 노래들의 특성 값 가져오기
        # genre_features = df_filtered[df_filtered['id'].isin(df['id'])].drop(columns=['id'])
        
        data['features'] = data['features'].drop(columns='id')
        avg_features = data['features'].mean(axis=0)
        # 평균값 계산
        # avg_features = features.mean(axis=0)
        genre_avg_features[data['genres']] = avg_features
    
    # print(genre_avg_features)

    # 1. 장르별 평균 특성을 df_filtered의 구조에 맞게 확장
    extended_avg_features = {}

    # 가중치 설정
    genre_weight = 100  # 예시로 특정 장르에 2배 가중치 부여

    for genre, avg_features in genre_avg_features.items():
        # df_filtered의 컬럼에 맞는 빈 데이터프레임 생성
        extended_feature = pd.Series(0, index=df_filtered.columns.drop('id'))
        
        # 평균 특성 벡터를 추가
        for feature in avg_features.index:
            extended_feature[feature] = avg_features[feature]
        
        # 장르에 해당하는 컬럼에 가중치 적용
        if genre in extended_feature.index:
            extended_feature[genre] = genre_weight
        
        # 확장된 특성 벡터 저장
        extended_avg_features[genre] = extended_feature

    # 5. 각 장르에 대해 추천 곡 출력
    for genre, avg_features in genre_avg_features.items():
        # 타겟 장르의 평균 벡터 가져오기
        target_avg_features = extended_avg_features[genre].values.reshape(1, -1)
        
        # 코사인 유사도 계산
        sim_scores = list(enumerate(cosine_similarity(target_avg_features, X_scaled)[0]))
        
        # 유사도 정렬
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # 곡 추천 (상위 n개 선택)
        recommended_indices = [score[0] for score in sim_scores[:5]]
        
        # 추천된 곡의 정보 가져오기
        recommended_songs = df_filtered.iloc[recommended_indices][['id']]
        
        # 추천된 곡의 정보와 df_encoded 병합하여 title 가져오기
        recommended_songs_with_titles = recommended_songs.merge(df_encoded[['id', 'number', 'title', 'singer']], on='id', how='left')

        print(recommended_songs_with_titles)

    # sim_scores = list(enumerate(cosine_similarity([avg_features], X_scaled)[0]))
    # sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # sim_scores = [score for score in sim_scores if score[0] not in indices]
    # sim_scores = sim_scores[:n_recommendations]
    # song_indices = [i[0] for i in sim_scores]
    # recommended_songs = df.iloc[song_indices][['id', 'number', 'title', 'singer']]
    # recommended_songs['similarity_score'] = [score[1] for score in sim_scores]
    return recommended_songs_with_titles

def get_recommendations_mf(song_ids, df, df_encoded, X_scaled, genre_weight=2, n_recommendations=5):
    # 1. 입력된 곡들의 인덱스 찾기
    indices = [df[df['id'] == song_id].index[0] for song_id in song_ids]
    
    # 2. 입력된 곡들에 대한 필터링
    filtered_songs = df_encoded[df_encoded['id'].isin(song_ids)]

    # 3. 장르 칼럼 추출
    genre_columns = [col for col in df_encoded.columns if col.startswith('genre_')]
    filtered_genres = filtered_songs[genre_columns]

    # 4. True인 장르들만 해당 row의 song_id와 함께 저장
    genre_filtered_rows = []
    for index, row in filtered_genres.iterrows():
        true_genres = row[row == True].index.tolist()
        song_id = filtered_songs.loc[index, 'id']
        genre_filtered_rows.append({'song_id': song_id, 'genres': true_genres})

    # 5. 새로운 데이터프레임 생성
    genre_filtered_df = pd.DataFrame(genre_filtered_rows)

    # 6. 특성 칼럼 리스트 정의 (X_scaled에 맞춰 수정)
    features_columns = X_scaled.columns.tolist()

    # 7. 필요한 칼럼만 선택하여 새로운 DataFrame 생성
    df_filtered = df_encoded[['id'] + features_columns + genre_columns]

    # 8. 장르별 그룹화
    genre_filtered_df['genres_str'] = genre_filtered_df['genres'].apply(lambda x: ','.join(x))
    grouped_genre_df = genre_filtered_df.groupby('genres_str')['song_id'].apply(list).reset_index()

    # 9. 각 장르 그룹에 대해 특성 가져오기
    grouped_features = []
    for _, row in grouped_genre_df.iterrows():
        genre_str = row['genres_str']
        song_ids = row['song_id']
        matched_songs = df_filtered[df_filtered['id'].isin(song_ids)]
        features = matched_songs[['id'] + features_columns]
        grouped_features.append({'genres': genre_str, 'features': features})

    # 10. 각 장르 그룹의 평균 특성 계산
    genre_avg_features = {}
    for data in grouped_features:
        features_without_id = data['features'].drop(columns='id')
        avg_features = features_without_id.mean(axis=0)
        genre_avg_features[data['genres']] = avg_features

    # 11. TruncatedSVD를 사용하여 차원 축소 (전체 데이터에 대해 한 번만 수행)
    svd = TruncatedSVD(n_components=15)
    latent_features = svd.fit_transform(X_scaled)

    # 12. 장르별 MF 및 추천
    genre_recommendations = []
    
    for genre, avg_features in genre_avg_features.items():
        # 평균 특성을 잠재 공간으로 변환
        avg_latent_features = svd.transform([avg_features])[0]
        
        # 해당 장르의 곡들만 필터링
        genre_songs = df_encoded[df_encoded[genre.split(',')].all(axis=1)]
        genre_indices = genre_songs.index
        
        # 장르 벡터 생성 및 가중치 적용
        genre_vectors = genre_songs[genre_columns].values
        weighted_genre_vectors = genre_vectors * genre_weight
        
        # 장르와 특성 결합한 벡터 생성
        genre_combined_features = np.hstack((latent_features[genre_indices], weighted_genre_vectors))
        
        # 유사도 계산
        target_vector = np.concatenate((avg_latent_features, np.zeros(len(genre_columns))))
        sim_scores = cosine_similarity([target_vector], genre_combined_features)[0]
        
        # 유사도 정렬 및 상위 n개 선택
        sim_scores_enum = list(enumerate(sim_scores))
        sim_scores_enum = sorted(sim_scores_enum, key=lambda x: x[1], reverse=True)
        sim_scores_enum = [score for score in sim_scores_enum if genre_indices[score[0]] not in indices]
        sim_scores_enum = sim_scores_enum[:n_recommendations]
        
        # 추천 곡 정보 가져오기
        song_indices = [genre_indices[i[0]] for i in sim_scores_enum]
        recommended_songs = df.iloc[song_indices][['id', 'number', 'title', 'singer']]
        recommended_songs['similarity_score'] = [score[1] for score in sim_scores_enum]
        recommended_songs['genre'] = genre
        
        genre_recommendations.append(recommended_songs)
        print(f"Recommendations for {genre}:")
        print(recommended_songs)
        print("\n")

    # 13. 장르별 추천 결과 병합
    all_recommendations = pd.concat(genre_recommendations, ignore_index=True)
    
    return all_recommendations


# def get_recommendations_mf(song_numbers, df, df_encoded, X_scaled, n_recommendations=20):
#     # 1. TruncatedSVD를 사용하여 차원 축소
#     svd = TruncatedSVD(n_components=15)
#     latent_features = svd.fit_transform(X_scaled)
    
#     # 2. 입력된 곡들의 인덱스 찾기
#     indices = [df[df['number'] == song_number].index[0] for song_number in song_numbers]
    
#     # 3. 입력된 곡들의 잠재 특성 평균 계산
#     avg_latent_features = np.mean(latent_features[indices], axis=0)
    
#     # 4. 모든 곡과의 유사도 계산
#     sim_scores = cosine_similarity([avg_latent_features], latent_features)[0]
    
#     # 5. 유사도 점수 정렬 및 필터링
#     sim_scores_enum = list(enumerate(sim_scores))
#     sim_scores_enum = sorted(sim_scores_enum, key=lambda x: x[1], reverse=True)
#     sim_scores_enum = [score for score in sim_scores_enum if score[0] not in indices]
#     sim_scores_enum = sim_scores_enum[:n_recommendations]
    
#     # 6. 추천 곡 정보 반환
#     song_indices = [i[0] for i in sim_scores_enum]
#     recommended_songs = df.iloc[song_indices][['number', 'title', 'singer']]
#     recommended_songs['similarity_score'] = [score[1] for score in sim_scores_enum]
    
#     return recommended_songs



def get_recommendations_neural_network(song_numbers, df, df_encoded, X_scaled, n_recommendations=20):
    # 입력된 곡들의 인덱스 찾기
    input_indices = [df[df['number'] == song_number].index[0] for song_number in song_numbers]
    
    # 신경망 모델을 훈련
    nn_model = MLPRegressor(hidden_layer_sizes=(100,), max_iter=500)
    nn_model.fit(X_scaled, X_scaled)  # 학습 목표를 특징 자체로 설정
    
    # 입력된 곡들의 평균 특징 계산
    avg_features = np.mean(X_scaled[input_indices], axis=0).reshape(1, -1)
    
    # 예측을 통해 유사한 곡 추천
    predictions = nn_model.predict(avg_features)
    
    # 코사인 유사도를 사용해 추천곡 정렬
    sim_scores = cosine_similarity(predictions, X_scaled)[0]
    sim_scores_enum = list(enumerate(sim_scores))
    sim_scores_enum = sorted(sim_scores_enum, key=lambda x: x[1], reverse=True)
    
    # 이미 선택된 곡은 제외하고, 추천 곡을 선택
    sim_scores_enum = [score for score in sim_scores_enum if score[0] not in input_indices]
    sim_scores_enum = sim_scores_enum[:n_recommendations]
    
    # 추천된 곡을 반환
    song_indices = [i[0] for i in sim_scores_enum]
    recommended_songs = df.iloc[song_indices][['number', 'title', 'singer']]
    recommended_songs['similarity_score'] = [score[1] for score in sim_scores_enum]
    
    return recommended_songs


def recommend_songs_cosine(request):
    song_numbers = request.GET.getlist('songs')
    if len(song_numbers) != 5:
        return JsonResponse({'error': 'Please provide exactly 5 song numbers'}, status=400)
    
    song_numbers = [int(num) for num in song_numbers]
    df, df_encoded, X_scaled = preprocess_data()
    recommended_songs = get_recommendations_cosine(song_numbers, df, df_encoded, X_scaled)
    input_songs = df[df['number'].isin(song_numbers)][['number', 'title', 'singer']]
    
    return render(request, 'songs/recommend.html', {
        'input_songs': input_songs.to_dict('records'),
        'songs': recommended_songs.to_dict('records'), 
        'method': 'Cosine Similarity'
    })



def recommend_songs_mf(request):
    song_numbers = request.GET.getlist('songs')
    if len(song_numbers) != 5:
        return JsonResponse({'error': 'Please provide exactly 5 song numbers'}, status=400)
    
    song_numbers = [int(num) for num in song_numbers]
    df, df_encoded, X_scaled = preprocess_data()
    recommended_songs = get_recommendations_mf(song_numbers, df, df_encoded, X_scaled)
    input_songs = df[df['number'].isin(song_numbers)][['number', 'title', 'singer']]
    
    return render(request, 'songs/recommend.html', {
        'input_songs': input_songs.to_dict('records'),
        'songs': recommended_songs.to_dict('records'), 
        'method': 'Matrix Factorization'
    })


def recommend_songs_neural_network(request):
    song_numbers = request.GET.getlist('songs')
    if len(song_numbers) != 5:
        return JsonResponse({'error': 'Please provide exactly 5 song numbers'}, status=400)
    
    song_numbers = [int(num) for num in song_numbers]
    df, df_encoded, X_scaled = preprocess_data()
    recommended_songs = get_recommendations_neural_network(song_numbers, df, df_encoded, X_scaled)
    input_songs = df[df['number'].isin(song_numbers)][['number', 'title', 'singer']]
    
    return render(request, 'songs/recommend.html', {
        'input_songs': input_songs.to_dict('records'),
        'songs': recommended_songs.to_dict('records'), 
        'method': 'Neural Network'
    })
