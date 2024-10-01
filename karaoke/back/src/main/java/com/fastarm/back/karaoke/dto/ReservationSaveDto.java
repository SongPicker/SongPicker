package com.fastarm.back.karaoke.dto;


import com.fastarm.back.connection.enums.Mode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationSaveDto {
    private int number;
    private String title;
    private String singer;
    private String nickname;
    private Long teamId;
    private Mode mode;
}
