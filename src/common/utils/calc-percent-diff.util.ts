export function calcDiff(
    current: bigint | number,
    previous: bigint | number,
): [number, number, number] {
    if (current < 0 || previous < 0) {
        return [0, 0, 0];
    }

    const curNum = Number(current);
    const prevNum = Number(previous);

    if (prevNum === 0) {
        if (curNum === 0) {
            return [0, 0, 0];
        }
        return [curNum, prevNum, curNum];
    }

    return [curNum, prevNum, curNum - prevNum];
}

export function calcPercentDiff(
    current: bigint | number,
    previous: bigint | number,
): [number, number, number] {
    if (current < 0 || previous < 0) {
        return [0, 0, 0];
    }

    const curNum = Number(current);
    const prevNum = Number(previous);

    if (prevNum === 0) {
        if (curNum === 0) {
            return [curNum, prevNum, 0];
        }
        return [curNum, prevNum, 100];
    }

    const percentage = Math.round(((curNum - prevNum) / prevNum) * 100);

    return [curNum, prevNum, percentage];
}
