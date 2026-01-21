export const TYPE_OPTIONS = [
    { label: "대기", value: "STAY" },
    { label: "경유", value: "WAYPOINT" },
    { label: "주유", value: "OIL" },
    { label: "통행료(톨비)", value: "TOLLGATE" },
    { label: "세차", value: "WASH" },
    { label: "기타", value: "ETC" },
]

export const ACCIDENT_TYPE_OPTIONS = [
    { label: "미정", value: "NONE" },
    { label: "보험", value: "INSURANCE" },
    { label: "합의", value: "AGREEMENT" },
]

export const TABS = [
    {
        name: "정면",
        position: "FRONT",
        subType: "ETC",
        label: '추가 사진',
        min: 3,
        max: 10,
        thumbnail: require('@assets/images/sample/car_front.png'),
        imageText: "차량 앞 유리, 라이트 확인",
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "ETC",
        label: '추가 사진',
        min: 4,
        max: 10,
        thumbnail: require('@assets/images/sample/car_right.png'),
        imageText: "타이어 및 유리, 사이드미러와 도어 확인",
    },
    {
        name: "후면",
        position: "BACK",
        subType: "ETC",
        label: '추가 사진',
        min: 3,
        max: 10,
        thumbnail: require('@assets/images/sample/car_back.png'),
        imageText: "후면 유리, 범퍼 확인",
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "ETC",
        label: '추가 사진',
        min: 4,
        max: 10,
        thumbnail: require('@assets/images/sample/car_left.png'),
        imageText: "타이어 및 유리, 사이드미러와 도어 확인",
    },
    {
        name: "내부",
        position: "INSIDE",
        subType: "ETC",
        label: '추가 사진',
        min: 2,
        max: 10,
        thumbnail: require('@assets/images/sample/car_inside.png'),
        imageText: "계기판의 km와 주유량, 앞뒤좌석 내부 물건 확인",
    },
]

export const IMAGE_LAYOUTS = [
    {
        name: "정면",
        position: "FRONT",
        subType: "ALL",
        label: "전체",
        thumbnail: require('@assets/images/thumbnail/front_all.png')
    },
    {
        name: "정면",
        position: "FRONT",
        subType: "BONNET_MIRROR",
        label: "앞유리/본넷",
        thumbnail: require('@assets/images/thumbnail/front_bonnet_mirror.png'),
    },
    {
        name: "정면",
        position: "FRONT",
        subType: "BOTTOM",
        label: "하부",
        thumbnail: require('@assets/images/thumbnail/front_bottom.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "FRONT_BUMPER",
        label: "앞범퍼",
        thumbnail: require('@assets/images/thumbnail/right_front_bumper.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "FRONT_WHEEL",
        label: "타이어/휠 (앞)",
        thumbnail: require('@assets/images/thumbnail/right_front_wheel.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "DRIVER_SEAT",
        label: "운전석 도어",
        thumbnail: require('@assets/images/thumbnail/right_front_seat.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "PASSENGER_SEAT",
        label: "조수석 도어",
        thumbnail: require('@assets/images/thumbnail/right_back_seat.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "BACK_WHEEL",
        label: "타이어/휠 (뒤)",
        thumbnail: require('@assets/images/thumbnail/right_back_wheel.png')
    },
    {
        name: "우측",
        position: "RIGHT",
        subType: "BACK_BUMPER",
        label: "뒷범퍼",
        thumbnail: require('@assets/images/thumbnail/right_back_bumper.png')
    },
    {
        name: "후면",
        position: "BACK",
        subType: "ALL",
        label: "전체",
        thumbnail: require('@assets/images/thumbnail/back_all.png')
    },
    {
        name: "후면",
        position: "BACK",
        subType: "TRUNK_MIRROR",
        label: "뒷유리/트렁크",
        thumbnail: require('@assets/images/thumbnail/back_trunk_mirror.png')
    },
    {
        name: "후면",
        position: "BACK",
        subType: "BOTTOM",
        label: "하부",
        thumbnail: require('@assets/images/thumbnail/back_bottom.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "BACK_BUMPER",
        label: "뒷범퍼",
        thumbnail: require('@assets/images/thumbnail/left_back_bumper.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "BACK_WHEEL",
        label: "타이어/휠 (뒤)",
        thumbnail: require('@assets/images/thumbnail/left_back_wheel.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "PASSENGER_SEAT",
        label: "조수석 도어",
        thumbnail: require('@assets/images/thumbnail/left_passenger_seat.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "DRIVER_SEAT",
        label: "운전석 도어",
        thumbnail: require('@assets/images/thumbnail/left_driver_seat.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "FRONT_WHEEL",
        label: "타이어/휠 (앞)",
        thumbnail: require('@assets/images/thumbnail/left_front_wheel.png')
    },
    {
        name: "좌측",
        position: "LEFT",
        subType: "FRONT_BUMPER",
        label: "앞범퍼",
        thumbnail: require('@assets/images/thumbnail/left_front_bumper.png')
    },
    {
        name: "내부",
        position: "INSIDE",
        subType: "DASHBOARD",
        label: "계기판",
        thumbnail: require('@assets/images/thumbnail/inside_dashboard.png')
    },
    {
        name: "내부",
        position: "INSIDE",
        subType: "CENTER_FASCIA",
        label: "센터페시아(중앙)",
        thumbnail: require('@assets/images/thumbnail/inside_center_fascia.png')
    },
]