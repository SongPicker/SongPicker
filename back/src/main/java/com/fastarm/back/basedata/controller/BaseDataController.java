package com.fastarm.back.basedata.controller;

import com.fastarm.back.auth.security.dto.LoginMemberInfo;
import com.fastarm.back.basedata.controller.dto.BaseDataAddRequest;
import com.fastarm.back.basedata.controller.dto.PopularGetResponse;
import com.fastarm.back.basedata.dto.BaseDataAddDto;
import com.fastarm.back.basedata.service.BaseDataService;
import com.fastarm.back.common.controller.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/base-data")
@RequiredArgsConstructor
public class BaseDataController {

    private final BaseDataService baseDataService;

    @GetMapping("/initial")
    public ResponseEntity<?> popularList(@PageableDefault(size = 33, sort = "id") Pageable pageable) {
        Slice<PopularGetResponse> result = baseDataService.getPopularList(pageable);
        return ResponseEntity.ok(new ApiResponse<>("BD100", "선택 데이터 항목 조회 성공", result));
    }

    @PostMapping
    public ResponseEntity<?> BaseDataSave(@RequestBody BaseDataAddRequest baseDataAddRequest,
                                          @AuthenticationPrincipal LoginMemberInfo loginMemberInfo) {
        baseDataService.addBaseData(BaseDataAddDto.builder()
                        .ids(baseDataAddRequest.getIds())
                        .loginId(loginMemberInfo.getLoginId())
                        .build());
        return ResponseEntity.ok(new ApiResponse<>("BD101", "초기 데이터 설정 성공", null));
    }
}
