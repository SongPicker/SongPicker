package com.fastarm.back.likes.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.common.controller.dto.ApiResponse;
import com.fastarm.back.likes.controller.dto.LikesAddRequest;
import com.fastarm.back.likes.controller.dto.LikesListResponse;
import com.fastarm.back.likes.dto.LikesRemoveDto;
import com.fastarm.back.likes.service.LikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/likes")
public class LikesController {

    private final LikesService likesService;

    @PostMapping
    public ResponseEntity<?> likesAdd(@RequestBody LikesAddRequest request,
                                      @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        likesService.addLikes(request.toDto(loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("LI100", "찜 등록 성공", null));
    }

    @DeleteMapping("/{songNumber}")
    public ResponseEntity<?> likesRemove(@PathVariable int songNumber,
                                         @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        likesService.removeLikes(new LikesRemoveDto(songNumber, loginMemberInfo.getLoginId()));
        return ResponseEntity.ok(new ApiResponse<>("LI101", "찜 삭제 성공", null));
    }

    @GetMapping
    public ResponseEntity<?> likesList(@AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        List<LikesListResponse> result = likesService.findLikesList(loginMemberInfo.getLoginId());
        return ResponseEntity.ok(new ApiResponse<>("LI102", "찜 목록 조회 성공", result));
    }

}
