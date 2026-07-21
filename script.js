// ランドマーク一覧
const spots = [
    {
        name: "新発田城跡",        //ランドマーク名称
        lat: 37.954824724542696,   //緯度
        lng: 139.326001834219947,  //経度
        radius: 50,                //leaflet-circle-radius[m] 有効範囲
        image:"image/castle.png"         //イメージ画像
    },
    {
        name: "清水園",
        lat: 37.943791,
        lng: 139.328785,
        radius: 50,
    },
    {
        name: "蔵春閣",
        lat: 37.94389807273562,
        lng: 139.3317142467578,
        radius: 10
    },
    {
        name: "東公園のSL",
        lat: 37.94367248807764,
        lng: 139.3323475293261,
        radius: 10,
    },
    {
        name: "諏訪神社",
        lat: 37.944214,
        lng: 139.332004,
        radius: 10,
    },
    {
        name: "新発田市役所",
        lat: 37.947839,
        lng: 139.327160,
        radius: 30,
    },
    {
        name: "王紋酒造",
        lat: 37.94436989072327,
        lng: 139.33066511399528,
        radius: 30,
    },
    {
        name: "五十公野公園",
        lat: 37.939869,
        lng: 139.356680,
        radius: 80,
        image:"image/park.png",
    },
    {
        name: "カルチャーセンター",
        lat: 37.950246,
        lng: 139.338618,
        radius: 30,
    },
    {
        name: "新発田駅",
        lat: 37.94413,
        lng: 139.33510,
        radius: 30,
        image:"image/station.png",
    },
    {
        name: "あやめの湯",
        lat: 37.953545,
        lng: 139.3549475,
        radius: 50,
    },
    {
        name: "イクネスしばた",
        lat: 37.944357,
        lng: 139.333388,
        radius: 30,
    },
    {
        name: "市民文化会館",
        lat: 37.951722,
        lng:139.326564,
        radius: 30,
    },
    {
        name: "新発田歴史図書館",
        lat: 37.951279909157336,
        lng: 139.32774756292181,
        radius: 30,
    },
    {
        name: "旧新発田市役所",
        lat: 37.950883,
        lng: 139.327898,
        radius: 30,
    },
    {
        name: "新潟職能短大",
        lat: 37.956067,
        lng: 139.337938,
        radius:150,
        image:"image/school.png",
    },
    {
        name: "菊水",
        lat: 37.960376479226,
        lng: 139.35429135822383,
        radius: 30,
    }
];

//激レアランドマーク
const spots2 =[
    {
      name: "藤倉メンチカツや",
      lat: 37.93682,
      lng: 139.34488,
    },
    {
      name: "ボン・タケダ",
      lat: 37.94039, 
      lng: 139.33600,
    }, 
    {
      name: "いっぷく",
      lat: 37.94437654050752, 
      lng: 139.3407439626735,
    },
    {
      name: "文化洋食ino",
      lat: 37.96236411397717, 
      lng: 139.33428189358867 ,
    },
    {
      name: "やすけカレー",
      lat: 37.93774827263629, 
      lng: 139.33615892651278 ,
    },
    {
      name: "激レア６",
      lat: 37.93774827263629, 
      lng: 139.33615892651278 ,
    },
    {
      name: "激レア７",
      lat: 37.93774827263629, 
      lng: 139.33615892651278 ,
    },
]

// ====== 地図初期化（中心を新富町に） ======
const map = L.map('map').setView([37.9555, 139.3400], 15);

// タイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//配列で指定したランドマークにマーカー表示
spots.forEach(spot => {
    //マーカークリック時にランドマーク名称とイメージ画像表示
    const popupContent = `
        <div style="text-align:center;">
            <h3>${spot.name}</h3>
            <img src="${spot.image}" width="200"><br>
        </div>
    `;
    L.marker([spot.lat, spot.lng]).addTo(map)
        .bindPopup(popupContent);

    //クイズ出題可能範囲の円
    L.circle([spot.lat, spot.lng], {
        radius: spot.radius,
        color: 'red',
        fillOpacity: 0.2
    }).addTo(map);
});

// ====== 距離計算 ======
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = x => x * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat/2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng/2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ====== 現在地取得 ======
let visitedSpots = new Set();

navigator.geolocation.watchPosition(position => {

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

//画面上に緯度経度表示(小数点以下6桁)
document.getElementById("coords").innerHTML = `
    緯度: ${userLat.toFixed(6)}<br>
    経度: ${userLng.toFixed(6)}<br>
`;

    // 現在地マーカー更新
    if (window.userMarker) {
        map.removeLayer(window.userMarker);
    }
    window.userMarker = L.marker([userLat, userLng]).addTo(map)
        .bindPopup("現在地");

    let found = false;

    spots.forEach(spot => {
        const distance = getDistance(userLat, userLng, spot.lat, spot.lng);

        // ランドマーク到着時の表示テキスト&クイズ画面へ移動
        if (!visitedSpots.has(spot.name) && distance <= spot.radius) {
            visitedSpots.add(spot.name);
            found = true;

            document.getElementById("result").innerHTML = `
                <b>${spot.name}に到達！</b><br>
                <a href="quiz.html?spot=${encodeURIComponent(spot.name)}">クイズへ</a>
            `;
        }
    });

    if (!found) {
        document.getElementById("result").innerHTML =
            "新発田市内を移動してください";
    }

}, () => {
    alert("位置情報が取得できません");
}); 
