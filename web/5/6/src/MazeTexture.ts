import {MazeElementType} from "./Maze.ts";
import {loadTexture} from "./WebGLUtils.ts";

const mazeTypeToTexturePathMap: Map<MazeElementType, string> = {
    [MazeElementType.ONE]:   '1.jpg',
    [MazeElementType.TWO]:   '2.jpg',
    [MazeElementType.THREE]: '3.jpg',
    [MazeElementType.FOUR]:  '4.jpg',
    [MazeElementType.FIVE]:  '5.jpg',
    [MazeElementType.SIX]:   '6.jpg',
};

export function initTextureMap(gl): Map<MazeElementType, WebGLTexture> {
    let typeToWallTextureMap = new Map<number, WebGLTexture>();
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.ONE);
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.TWO);
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.THREE);
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.FOUR);
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.FIVE);
    loadTextureItem(typeToWallTextureMap, gl, MazeElementType.SIX);
    return typeToWallTextureMap;
}

function loadTextureItem(map: Map<number, WebGLTexture>, gl, type: MazeElementType) {
    map[type] = loadTexture(gl, mazeTypeToTexturePathMap[type], () => {});
}