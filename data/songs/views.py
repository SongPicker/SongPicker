import numpy as np
import pandas as pd
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

    # song_ids 추출 (노래 ID 리스트)
    song_ids = [song['song_id'] for song in recent_songs]

    # 데이터 전처리
    df, df_encoded, X_scaled = preprocess_data()

    recommended_songs = get_recommendations_cosine(song_ids, df, df_encoded, X_scaled)
        
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
    df_encoded['release_year'] = pd.to_datetime(df_encoded['released_at']).dt.year
    
    # 원핫 인코딩된 'genre' 컬럼과 'release_year' 추가
    features = ['bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded']
    features += [col for col in df_encoded.columns if col.startswith('genre_')]
    features.append('release_year')
    
    X = df_encoded[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, df_encoded, X_scaled

def get_recommendations_cosine(song_ids, df, df_encoded, X_scaled, n_recommendations=20):
    indices = [df[df['id'] == song_id].index[0] for song_id in song_ids]
    avg_features = np.mean(X_scaled[indices], axis=0)
    sim_scores = list(enumerate(cosine_similarity([avg_features], X_scaled)[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [score for score in sim_scores if score[0] not in indices]
    sim_scores = sim_scores[:n_recommendations]
    song_indices = [i[0] for i in sim_scores]
    recommended_songs = df.iloc[song_indices][['id', 'number', 'title', 'singer']]
    # recommended_songs['similarity_score'] = [score[1] for score in sim_scores]
    return recommended_songs


def get_recommendations_mf(song_numbers, df, df_encoded, X_scaled, n_recommendations=20):
    # 1. TruncatedSVD를 사용하여 차원 축소
    svd = TruncatedSVD(n_components=15)
    latent_features = svd.fit_transform(X_scaled)
    
    # 2. 입력된 곡들의 인덱스 찾기
    indices = [df[df['number'] == song_number].index[0] for song_number in song_numbers]
    
    # 3. 입력된 곡들의 잠재 특성 평균 계산
    avg_latent_features = np.mean(latent_features[indices], axis=0)
    
    # 4. 모든 곡과의 유사도 계산
    sim_scores = cosine_similarity([avg_latent_features], latent_features)[0]
    
    # 5. 유사도 점수 정렬 및 필터링
    sim_scores_enum = list(enumerate(sim_scores))
    sim_scores_enum = sorted(sim_scores_enum, key=lambda x: x[1], reverse=True)
    sim_scores_enum = [score for score in sim_scores_enum if score[0] not in indices]
    sim_scores_enum = sim_scores_enum[:n_recommendations]
    
    # 6. 추천 곡 정보 반환
    song_indices = [i[0] for i in sim_scores_enum]
    recommended_songs = df.iloc[song_indices][['number', 'title', 'singer']]
    recommended_songs['similarity_score'] = [score[1] for score in sim_scores_enum]
    
    return recommended_songs



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
