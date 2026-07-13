// ====== スポット ======
const spots = [
    {
        name: "新発田城跡",
        lat: 37.954824724542696,
        lng: 139.326001834219947,
        radius: 50,
        image: "castle.png"
    },
    {
        name: "清水園",
        lat: 37.943791,
        lng: 139.328785,
        radius: 50,
    },
    {
        name: "新潟職能短大",
        lat: 37.956067,
        lng: 139.337938,
        radius: 150,
    }
];

// ====== 地図 ======
const map = L.map('map').setView([37.9555, 139.3400], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ====== スポット表示 ======
spots.forEach(spot => {
    L.marker([spot.lat, spot.lng]).addTo(map)
        .bindPopup(`<h3>${spot.name}</h3>`);

    L.circle([spot.lat, spot.lng], {
        radius: spot.radius,
        color: 'red'
    }).addTo(map);
});

// ====== 距離計算 ======
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = x => x * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ====== 最寄り避難所 ======
function findNearestShelter(userLat, userLng) {
    let nearest = null;
    let minDistance = Infinity;

    shelters.forEach(s => {
        const d = getDistance(userLat, userLng, s.lat, s.lng);
        if (d < minDistance) {
            minDistance = d;
            nearest = s;
        }
    });

    return { shelter: nearest, distance: minDistance };
}

// ====== 方角 ======
function getDirection(lat1, lng1, lat2, lng2) {
    const toRad = x => x * Math.PI / 180;

    const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
    const x =
        Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
        Math.sin(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.cos(toRad(lng2 - lng1));

    let brng = Math.atan2(y, x) * 180 / Math.PI;
    brng = (brng + 360) % 360;

    const dirs = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
    return dirs[Math.round(brng / 45) % 8];
}

// ====== 警報（簡易） ======
function getWarning() {
    return`<span class="warning">現在：警報なし（デモ）</span>`;
}

// ====== 現在地 ======
let visitedSpots = new Set();

navigator.geolocation.watchPosition(position => {

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    // ====== 現在地表示 ======
    document.getElementById("coords").innerHTML = `
        <b>現在地</b><br>
        緯度:${userLat.toFixed(6)}<br>
        経度:${userLng.toFixed(6)}<br>
    `;

    // マーカー
    if (window.userMarker) {
        map.removeLayer(window.userMarker);
    }

    window.userMarker = L.marker([userLat, userLng]).addTo(map);

    // ====== 観光判定 ======
    let found = false;

    spots.forEach(spot => {
        const distance = getDistance(userLat, userLng, spot.lat, spot.lng);

        if (!visitedSpots.has(spot.name) && distance <= spot.radius) {
            visitedSpots.add(spot.name);
            found = true;

            document.getElementById("result").innerHTML = `
                <b>${spot.name}に到達！</b><br>
                <a href="quiz.html?spot=${encodeURIComponent(spot.name)}">クイズへ</a>
            `;
        }
    });

    // ====== 防災情報（常に表示） ======
    const nearestData = findNearestShelter(userLat, userLng);

    let disasterInfo = "";

    if (nearestData.shelter) {
        const dir = getDirection(
            userLat,
            userLng,
            nearestData.shelter.lat,
            nearestData.shelter.lng
        );

        disasterInfo = `
            <br><br>
            <b>【防災情報】</b><br>
            避難所：${nearestData.shelter.name}<br>
            距離：約${Math.round(nearestData.distance)}m<br>
            方向：${dir}<br>
            ${getWarning()}
        `;
    }

    // ====== 表示 ======
    if (!found) {
        document.getElementById("result").innerHTML =
            "市内を移動してください" + disasterInfo;
    } else {
        document.getElementById("result").innerHTML += disasterInfo;
    }

}, () => {
    alert("位置情報が取得できません");
});


