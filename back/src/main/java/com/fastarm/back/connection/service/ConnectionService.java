package com.fastarm.back.connection.service;

import com.fastarm.back.connection.controller.dto.ConnectionStatusGetResponse;
import com.fastarm.back.connection.dto.ConnectionDto;
import com.fastarm.back.connection.dto.ReservationDto;
import com.fastarm.back.connection.dto.TeamConnectionDto;

public interface ConnectionService {
    void setConnection(ConnectionDto connectionDto);
    void setTeamConnection(TeamConnectionDto teamConnectionDto);
    ConnectionStatusGetResponse getConnectionStatus(String loginId);
    void removeConnection(String loginId);
    void reserveSong(ReservationDto reservationDto);
}
