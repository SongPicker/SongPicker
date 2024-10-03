package com.fastarm.back.karaoke.controller.dto;

import com.fastarm.back.connection.enums.Mode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionFindResponse {
    private String nickname;
    private String loginId;
    private String teamName;
    private Long teamId;
    private Mode mode;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConnectionFindResponse that = (ConnectionFindResponse) o;

        if (this.mode == Mode.TEAM) {
            return Objects.equals(teamId, that.teamId);
        } else if (this.mode == Mode.INDIVIDUAL) {
            return Objects.equals(loginId, that.loginId);
        }
        return false;
    }

    @Override
    public int hashCode() {
        if (mode == Mode.TEAM) {
            return Objects.hash(teamId);
        } else if (mode == Mode.INDIVIDUAL) {
            return Objects.hash(loginId);
        }
        return super.hashCode();
    }
}
