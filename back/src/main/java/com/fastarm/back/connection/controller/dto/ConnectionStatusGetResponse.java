package com.fastarm.back.connection.controller.dto;

import com.fastarm.back.connection.entity.ConnectionInfo;
import com.fastarm.back.connection.enums.Mode;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.checkerframework.checker.units.qual.C;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionStatusGetResponse {
    private Boolean isConnected;
    private Mode mode;
    private String teamName;

    public static ConnectionStatusGetResponse from(ConnectionInfo connectionInfo) {
        return ConnectionStatusGetResponse.builder()
                .isConnected(true)
                .mode(connectionInfo.getMode())
                .build();
    }
}
