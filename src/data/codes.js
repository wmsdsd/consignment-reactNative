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
        key: "FRONT",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_front.png'),
        imageText: "차량 앞 유리, 라이트 확인"
    },
    {
        name: "좌측",
        key: "LEFT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_left.png'),
        imageText: "타이어 및 유리, 사이드미러와 도어 확인"
    },
    {
        name: "후면",
        key: "BACK",
        min: 3,
        max: 5,
        sampleImage: require('@assets/images/sample/car_back.png'),
        imageText: "후면 유리, 범퍼 확인"
    },
    {
        name: "우측",
        key: "RIGHT",
        min: 2,
        max: 5,
        sampleImage: require('@assets/images/sample/car_right.png'),
        imageText: "타이어 및 유리, 사이드미러와 도어 확인"
    },
    {
        name: "내부 및 계기판",
        key: "INSIDE",
        min: 3,
        max: 10,
        sampleImage: require('@assets/images/sample/car_inside.png'),
        imageText: "계기판의 km와 주유량, 앞뒤좌석 내부 물건 확인"
    },
    // {
    //     name: "하부",
    //     key: "BOTTOM",
    //     selected: false,
    //     min: 2,
    //     max: 5
    // },
]
