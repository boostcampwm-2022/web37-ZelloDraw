import hexToRgba from 'hex-to-rgba';

export const convertHexToRgba = (color: string) => {
    const rgbaStr = hexToRgba(color);
    const rgba = rgbaStr
        .substring(5, rgbaStr.length - 1)
        .split(',')
        .map((str: string) => Number(str));
    return new Uint8ClampedArray(rgba);
};

export const isValidSquare = (imageData: any, x: number, y: number) => {
    return x >= 0 && x < imageData.width && y >= 0 && y < imageData.height;
};

export const getPixelOffset = (imageData: any, x: number, y: number) => {
    return (y * imageData.width + x) * 4;
};

export const getPixelColor = (imageData: any, x: number, y: number) => {
    if (isValidSquare(imageData, x, y)) {
        const offset = getPixelOffset(imageData, x, y);
        return imageData.data.slice(offset, offset + 4);
    } else {
        return [-1, -1, -1, -1]; // invalid color
    }
};

export function isSameColor(a: Uint8ClampedArray, b: Uint8ClampedArray) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export const setPixel = (imageData: any, x: number, y: number, color: Uint8ClampedArray) => {
    const offset = getPixelOffset(imageData, x, y);
    imageData.data[offset + 0] = color[0];
    imageData.data[offset + 1] = color[1];
    imageData.data[offset + 2] = color[2];
    imageData.data[offset + 3] = color[0];
};
