package com.fastarm.back.song.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Theme {

    THEME_BALLAD("발라드", "난 센치할 때 발라드를 불러"),
    THEME_DANCE("댄스", "DANCE! DANCE! DANCE!"),
    THEME_INDIE("인디음악", "요즘 뜨는 인디 음악"),
    THEME_HIPHOP("랩/힙합", "ㄴr는 ㄱr끔 난 힙합을 부른ㄷr.."),
    THEME_OST("국내드라마", "당장 노래방 가고픈 OST 메들리"),
    THEME_POP("POP", "부르는 순간 뉴욕 시티"),
    THEME_JPOP("J-POP", "요즘은 J-POP이 대세!"),
    THEME_ROCK("록/메탈", "나도 롹커! 소리 지르고 싶을 때")
    ;

    final String genre;
    final String themeTitle;
}