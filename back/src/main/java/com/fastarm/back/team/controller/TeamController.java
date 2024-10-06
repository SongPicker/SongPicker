package com.fastarm.back.team.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.song.controller.dto.SongDetailRequest;
import com.fastarm.back.team.controller.dto.*;
import com.fastarm.back.team.dto.TeamDetailDto;
import com.fastarm.back.team.dto.TeamDto;
import com.fastarm.back.team.dto.TeamWithdrawDto;
import com.fastarm.back.team.service.TeamService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teams")
public class TeamController {
    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<?> myTeamGet(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        List<TeamDto> teamDtoList = teamService.getMyTeams(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("TE103", "내 그룹 목록 조회 성공", teamDtoList));
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<?> teamDetailGet(@PathVariable Long teamId, @AuthenticationPrincipal LoginMemberInfo loginMemberInfo){
        TeamDetailDto teamDetailDto = teamService.getTeamDetail(TeamDetailRequest.from(teamId, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("TE104", "그룹 상세 조회 성공", teamDetailDto));
    }

    @PostMapping("/invite")
    public ResponseEntity<?> teamInvite(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo,
                                        @RequestBody TeamInviteRequest teamInviteRequest) throws ExecutionException, InterruptedException {
        TeamInviteResponse teamInviteResponse = teamService.inviteTeam(teamInviteRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("TE101", "그룹 초대 성공",teamInviteResponse));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> teamCreate(@Valid @ModelAttribute TeamAddRequest teamAddRequest,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws IOException {

        Long teamId = teamService.createTeam(teamAddRequest.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("TE100", "그룹 생성 성공", teamId));
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<?> teamModify(@Valid @ModelAttribute TeamModifyRequest teamModifyRequest,
                                        @PathVariable Long teamId,
                                        @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws IOException, URISyntaxException {
        teamService.modifyTeam(teamModifyRequest.toDto(teamId,loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("TE105","그룹 정보 수정 성공",null));
    }

    @DeleteMapping
    public ResponseEntity<?> teamWithdraw(@NotNull @RequestParam Long teamId,
                                          @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) throws URISyntaxException {

        teamService.withdrawTeam(TeamWithdrawDto.builder()
                .loginId(loginMemberInfo.getLoginId())
                .teamId(teamId)
                .build());

        return ResponseEntity.ok(new ApiResponse<>("TE102","그룹 나가기 성공",null));
    }


}
