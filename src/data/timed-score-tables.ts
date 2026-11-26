// Appendix 5, consolidated Order 230 edition 08.12.2025.
// Times are stored in seconds. Exercise 20 uses tenths of a second.
function range(start:number, firstPoints:number, count:number, step=1): [number,number][] {
  return Array.from({length:count},(_,i)=>[
    step===0.3?Number((start+i*step).toFixed(1)):start+i*step,
    firstPoints-i,
  ]);
}
export const verifiedTimedExerciseScores: Record<number, readonly (readonly [number,number])[]> = {
  20:[
    ...range(30.0,100,20,0.3),
    ...range(36.0,80,20,0.3),
    ...range(42.0,60,20,0.3),
    ...range(48.0,40,20,0.3),
    ...range(54.0,20,13,0.3),
    [57.7,7],[57.8,6],[57.9,5],[58.0,4],[58.1,3],[58.2,2],
  ],
  21:[
    ...range(70,100,25),
    ...range(95,75,25),
    ...range(120,50,25),
    [145,25],[146,24],[147,23],[148,22],[149,21],[150,20],
    [152,19],[154,18],[156,17],[158,16],[160,15],[162,14],
    [164,13],[166,12],[168,11],[170,10],[172,9],[174,8],
    [176,7],[178,6],[180,5],[185,4],[190,3],[195,2],
  ],
  22:[
    ...range(90,100,25),
    ...range(115,75,25),
    ...range(140,50,25),
    ...range(165,25,15),
    [180,10],[185,9],[190,8],[195,7],[200,6],[205,5],
    [210,4],[215,3],[220,2],
  ],
};
export const timedScoringSource = 'Приложение № 5, упражнения № 20–22; приказ МО РФ № 230 в редакции от 08.12.2025, страницы 65–68.';
