let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
function cardShuffle() {
    for (let i = arr.length - 1; i > 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1)); // 0부터 i까지의 정수

        [arr[i], arr[rand]] = [arr[rand], arr[i]] // 요소를 교환
    }
    return arr; // 섞인 배열 반환
}

