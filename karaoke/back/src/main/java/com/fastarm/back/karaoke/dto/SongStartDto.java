package com.fastarm.back.karaoke.dto;

import com.fastarm.back.connection.enums.Mode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SongStartDto {
    private String serialNumber;
    private int number;
    private String nickname;
    private Long teamId;
    private Mode mode;
}
