import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from django.shortcuts import render
from django.http import JsonResponse
from .models import Song, PersonalSingHistory
from django.forms.models import model_to_dict
from sklearn.neural_network import MLPRegressor

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def recommend_songs_api(request):
    input_data = request.data
    song_numbers = input_data.get('song_numbers', [])
    
    df, df_encoded, X_scaled = preprocess_data()
    # if df.isnull().values.any():
    #     return Response({'error': 'Input contains NaN.'}, status=400)

    # # 이곳에서 추천 알고리즘 호출 (예: 코사인 유사도)
    recommended_songs = get_recommendations_cosine(song_numbers, df, df_encoded, X_scaled)

    # # 추천 곡을 리스트 형태로 변환하여 반환
    recommended_songs_list = recommended_songs.to_dict('records')

    recommended_songs_list = [
        {'number': 1, 'title': 'Song Title 1', 'singer': 'Singer 1', 'similarity_score': 0.95},
        {'number': 2, 'title': 'Song Title 2', 'singer': 'Singer 2', 'similarity_score': 0.90},
        {'number': 3, 'title': 'Song Title 3', 'singer': 'Singer 3', 'similarity_score': 0.85},
        {'number': 4, 'title': 'Song Title 4', 'singer': 'Singer 4', 'similarity_score': 0.80},
        {'number': 5, 'title': 'Song Title 5', 'singer': 'Singer 5', 'similarity_score': 0.75},
    ]
    return Response(recommended_songs_list)


def preprocess_data():
    songs = Song.objects.all().values()

    df = pd.DataFrame.from_records(songs)
    # 예: 평균으로 대체
    df.fillna(df.mean(), inplace=True)
    df_encoded.fillna(df_encoded.mean(), inplace=True)

    
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
    
    # Tune을 순서형 데이터로 변환
    tune_map = {tune: i+1 for i, tune in enumerate(tune_order)}
    
    # 동일음 처리 (예: C# = D♭)
    equivalent_tunes = {
        'C# Major': 'D♭ Major', 'C# Minor': 'D♭ Minor',
        'D# Major': 'E♭ Major', 'D# Minor': 'E♭ Minor',
        'F# Major': 'G♭ Major', 'F# Minor': 'G♭ Minor',
        'G# Major': 'A♭ Major', 'G# Minor': 'A♭ Minor',
        'A# Major': 'B♭ Major', 'A# Minor': 'B♭ Minor'
    }
    tune_map.update({key: tune_map[value] for key, value in equivalent_tunes.items()})
    
    df['tune_encoded'] = df['tune'].map(tune_map)
    
    # 나머지 특성 처리
    features = ['bpm', 'energy', 'danceability', 'happiness', 'acousticness', 'tune_encoded']
    df_encoded = pd.get_dummies(df, columns=['genre'])  # 'genre'만 원핫 인코딩
    df_encoded['release_year'] = pd.to_datetime(df_encoded['released_at']).dt.year
    
    # 원핫 인코딩된 'genre' 컬럼과 'release_year' 추가
    features += [col for col in df_encoded.columns if col.startswith('genre_')]
    features.append('release_year')
    
    X = df_encoded[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, df_encoded, X_scaled

def get_recommendations_cosine(song_numbers, df, df_encoded, X_scaled, n_recommendations=20):
    indices = [df[df['number'] == song_number].index[0] for song_number in song_numbers]
    avg_features = np.mean(X_scaled[indices], axis=0)
    sim_scores = list(enumerate(cosine_similarity([avg_features], X_scaled)[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [score for score in sim_scores if score[0] not in indices]
    sim_scores = sim_scores[:n_recommendations]
    song_indices = [i[0] for i in sim_scores]
    recommended_songs = df.iloc[song_indices][['number', 'title', 'singer']]
    recommended_songs['similarity_score'] = [score[1] for score in sim_scores]
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


def get_songs_json(request):
    all_songs = Song.objects.all()
    songs_data = [model_to_dict(song) for song in all_songs]
    return JsonResponse({'songs': songs_data}, safe=False)

def recommend_songs_test(request):
    all_songs_history = PersonalSingHistory.objects.all()
    all_songs_history_data = [model_to_dict(song) for song in all_songs_history]
    return JsonResponse({'all_songs_history': all_songs_history_data}, safe=False)