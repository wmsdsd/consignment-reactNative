import { FlatList } from 'react-native';
import TaksongCard from '../../../components/TaksongCard';

// 가짜 탁송 데이터
const mockTaksongs = [
    {
        id: '1',
        status: '예약 완료',
        departure: '서울특별시 강남구 테헤란로 231',
        destination: '인천광역시 중구 공항로 272 인천국제공항',
        distance: '58km',
        time: '1시간 56분',
        price: '65,000원',
        vehicleNumber: '12가3456',
    },
    {
        id: '2',
        status: '기사배정',
        departure: '서울특별시 마포구 홍익로 59 홍대입구역',
        destination: '서울특별시 강서구 하늘길 112 김포국제공항',
        distance: '28km',
        time: '56분',
        price: '35,000원',
        vehicleNumber: '34나5678',
    },
    {
        id: '3',
        status: '예약 대기',
        departure: '서울특별시 광진구 능동로 120 건국대학교',
        destination: '서울특별시 중구 한강대로 405 서울역',
        distance: '12km',
        time: '24분',
        price: '18,000원',
        vehicleNumber: null,
    },
    {
        id: '4',
        status: '기사배정',
        departure: '경기도 성남시 분당구 판교로 235 판교타워',
        destination: '서울특별시 송파구 올림픽로 240 잠실역',
        distance: '35km',
        time: '1시간 10분',
        price: '42,000원',
        vehicleNumber: '56다7890',
    },
    {
        id: '5',
        status: '픽업 중',
        departure: '서울특별시 용산구 이태원로 145 이태원역',
        destination: '서울특별시 강남구 강남대로 396 강남역',
        distance: '8km',
        time: '16분',
        price: '12,000원',
        vehicleNumber: '78라9012',
    },
    {
        id: '6',
        status: '예약 완료',
        departure: '서울특별시 종로구 사직로 161 경복궁',
        destination: '서울특별시 중구 명동길 26 명동',
        distance: '5km',
        time: '15분',
        price: '10,000원',
        vehicleNumber: '90마1234',
    },
    {
        id: '7',
        status: '기사배정',
        departure: '서울특별시 용산구 한강대로 23 용산역',
        destination: '부산광역시 동구 중앙대로 206 부산역',
        distance: '325km',
        time: '10시간 50분',
        price: '280,000원',
        vehicleNumber: '12바3456',
    },
    {
        id: '8',
        status: '예약 완료',
        departure: '서울특별시 영등포구 여의공원로 68 여의도',
        destination: '인천광역시 중구 공항로 272 인천국제공항',
        distance: '52km',
        time: '1시간 44분',
        price: '58,000원',
        vehicleNumber: '34사5678',
    },
    {
        id: '9',
        status: '예약 대기',
        departure: '서울특별시 마포구 상암동 상암중앙로 76',
        destination: '서울특별시 종로구 세종대로 175 광화문',
        distance: '15km',
        time: '30분',
        price: '20,000원',
        vehicleNumber: null,
    },
    {
        id: '10',
        status: '기사배정',
        departure: '서울특별시 중구 을지로 281 동대문역사문화공원역',
        destination: '서울특별시 송파구 올림픽로 300 송파구청',
        distance: '18km',
        time: '36분',
        price: '25,000원',
        vehicleNumber: '56아7890',
    },
    {
        id: '11',
        status: '예약 완료',
        departure: '서울특별시 성동구 성수일로8길 37 성수동',
        destination: '서울특별시 송파구 올림픽로 240 잠실역',
        distance: '7km',
        time: '15분',
        price: '11,000원',
        vehicleNumber: '78자9012',
    },
    {
        id: '12',
        status: '픽업 중',
        departure: '서울특별시 강동구 천호대로 1037 강동구청',
        destination: '서울특별시 강서구 하늘길 112 김포국제공항',
        distance: '42km',
        time: '1시간 24분',
        price: '48,000원',
        vehicleNumber: '90차1234',
    },
    {
        id: '13',
        status: '예약 취소',
        departure: '서울특별시 서초구 서초대로 396 서초구청',
        destination: '경기도 부천시 원미구 시청로 30 부천시청',
        distance: '28km',
        time: '56분',
        price: '32,000원',
        vehicleNumber: null,
    },
    {
        id: '14',
        status: '기사배정',
        departure: '서울특별시 마포구 월드컵북로 396 마포구청',
        destination: '경기도 수원시 영통구 월드컵로 206 수원역',
        distance: '45km',
        time: '1시간 30분',
        price: '52,000원',
        vehicleNumber: '12카3456',
    },
    {
        id: '15',
        status: '예약 완료',
        departure: '서울특별시 노원구 상계로 571 노원구청',
        destination: '인천광역시 남동구 정각로 29 인천시청',
        distance: '55km',
        time: '1시간 50분',
        price: '62,000원',
        vehicleNumber: '34타5678',
    },
    {
        id: '16',
        status: '예약 대기',
        departure: '서울특별시 금천구 시흥대로 73 금천구청',
        destination: '경기도 고양시 일산동구 중앙로 1200 일산역',
        distance: '38km',
        time: '1시간 16분',
        price: '45,000원',
        vehicleNumber: null,
    },
    {
        id: '17',
        status: '기사배정',
        departure: '서울특별시 광진구 능동로 120 광진구청',
        destination: '경기도 의정부시 평화로 151 의정부역',
        distance: '25km',
        time: '50분',
        price: '30,000원',
        vehicleNumber: '56파7890',
    },
    {
        id: '18',
        status: '예약 완료',
        departure: '서울특별시 은평구 은평로 195 은평구청',
        destination: '경기도 성남시 분당구 정자일로 95 분당역',
        distance: '32km',
        time: '1시간 4분',
        price: '38,000원',
        vehicleNumber: '78하9012',
    },
    {
        id: '19',
        status: '픽업 중',
        departure: '서울특별시 종로구 새문안로 68 종로구청',
        destination: '경기도 안산시 단원구 광덕로 165 안산역',
        distance: '48km',
        time: '1시간 36분',
        price: '55,000원',
        vehicleNumber: '90호1234',
    },
    {
        id: '20',
        status: '기사배정',
        departure: '서울특별시 중구 세종대로 110 서울중앙우체국',
        destination: '경기도 고양시 덕양구 중앙로 415 고양시청',
        distance: '22km',
        time: '44분',
        price: '28,000원',
        vehicleNumber: '12허3456',
    },
];

export default function TaksongListScreen() {
    const renderItem = ({ item }) => (
        <TaksongCard
            id={item.id}
            status={item.status}
            price={item.price}
            carNumber={item.vehicleNumber}
            distance={item.distance}
            duration={item.time}
            start={item.departure}
            end={item.destination}
        />
    );
    
    return (
        <FlatList
            data={mockTaksongs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
            className="flex-1 bg-black"
            showsVerticalScrollIndicator={false}
        />
    );
}
