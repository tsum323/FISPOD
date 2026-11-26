// Appendix 5, Order 230 consolidated edition 08.12.2025.
// Each row contains four score bands. Each band is [result for category 1, category 2,
// category 3, points]. The category labels are sex-specific, but the table aligns the
// three body-mass categories in the same columns for women and men.
export type WeightCategory = '1' | '2' | '3';
type SourceRow = readonly [number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null,number|null];
function build(rows: readonly SourceRow[]): Record<WeightCategory, readonly (readonly [number,number])[]> {
  const result: Record<WeightCategory, [number,number][]> = { '1':[], '2':[], '3':[] };
  for (const row of rows) {
    for (let band=0; band<4; band++) {
      const offset=band*4, points=row[offset+3];
      if(points===null) continue;
      for (let category=0; category<3; category++) {
        const value=row[offset+category];
        if(value!==null) result[String(category+1) as WeightCategory].push([value,points]);
      }
    }
  }
  for (const category of ['1','2','3'] as const) {
    result[category].sort((a,b)=>a[0]-b[0]);
  }
  return result;
}
export const verifiedWeightedExerciseScores: Record<number, Record<WeightCategory, readonly (readonly [number,number])[]>> = {
10: build([
[65,75,85,100,47,57,67,64,29,39,49,33,11,21,31,15],
[64,74,84,98,46,56,66,62,28,38,48,32,10,20,30,14],
[63,73,83,96,45,55,65,60,27,37,47,31,9,19,29,13],
[62,72,82,94,44,54,64,58,26,36,46,30,8,18,28,12],
[61,71,81,92,43,53,63,56,25,35,45,29,null,17,27,11],
[60,70,80,90,42,52,62,53,24,34,44,28,7,16,26,10],
[59,69,79,88,41,51,61,50,23,33,43,27,null,15,25,9],
[58,68,78,86,40,50,60,47,22,32,42,26,6,14,24,8],
[57,67,77,84,39,49,59,45,21,31,41,25,5,13,23,7],
[56,66,76,82,38,48,58,43,20,30,40,24,4,12,22,6],
[55,65,75,80,37,47,57,41,19,29,39,23,3,11,21,5],
[54,64,74,78,36,46,56,40,18,28,38,22,2,10,20,4],
[53,63,73,76,35,45,55,39,17,27,37,21,1,9,19,3],
[52,62,72,74,34,44,54,38,16,26,36,20,null,8,18,2],
[51,61,71,72,33,43,53,37,15,25,35,19,null,7,17,1],
[50,60,70,70,32,42,52,36,14,24,34,18,null,null,null,null],
[49,59,69,68,31,41,51,35,13,23,33,17,null,null,null,null],
[48,58,68,66,30,40,50,34,12,22,32,16,null,null,null,null]
]),
11: build([
[22,26,30,100,null,null,23,86,11,15,17,65,5,8,10,30],
[21,25,29,98,15,19,null,85,10,14,16,60,null,7,9,26],
[20,24,28,96,null,null,22,84,9,13,15,55,4,6,8,22],
[19,23,27,94,null,null,21,82,8,12,14,50,null,5,7,20],
[18,22,26,92,14,18,20,80,7,11,13,45,3,4,6,16],
[17,21,25,90,13,17,19,75,6,10,12,40,null,null,5,12],
[16,20,24,88,12,16,18,70,null,9,11,35,2,3,4,8]
]),
12: build([
[18,24,28,100,null,17,21,86,8,11,14,60,null,4,7,24],
[null,23,27,98,13,16,20,84,7,10,13,55,null,null,6,20],
[17,22,26,96,null,null,19,82,6,9,12,50,2,3,5,16],
[16,21,25,94,12,15,18,80,5,8,11,45,null,null,4,12],
[15,20,24,92,11,14,17,75,4,7,10,40,1,2,3,8],
[null,19,23,90,10,13,16,70,null,6,9,35,null,null,null,null],
[14,18,22,88,9,12,15,65,3,5,8,30,null,null,null,null]
]),
14: build([
[18,23,30,100,11,16,22,85,6,11,14,62,2,5,6,30],
[17,22,29,98,null,null,21,82,5,10,13,58,null,4,5,25],
[16,21,28,96,10,15,20,80,null,null,12,54,null,3,4,20],
[15,20,27,94,9,14,19,77,4,9,11,50,1,2,3,15],
[14,19,26,92,null,null,18,74,null,8,10,46,null,1,2,10],
[13,18,25,90,8,13,17,70,null,null,9,43,null,null,1,8],
[12,17,24,88,null,null,16,68,3,7,8,40,null,null,null,null],
[null,null,23,86,7,12,15,66,null,6,7,35,null,null,null,null]
]),
15: build([
[22,26,28,100,16,20,22,88,10,14,16,60,4,8,10,30],
[21,25,27,98,15,19,21,85,9,13,15,55,3,7,9,25],
[20,24,26,96,14,18,20,80,8,12,14,50,2,6,8,20],
[19,23,25,94,13,17,19,75,7,11,13,45,1,5,7,16],
[18,22,24,92,12,16,18,70,6,10,12,40,null,4,6,10],
[17,21,23,90,11,15,17,65,5,9,11,35,null,3,5,5]
]),
16: build([
[22,26,30,100,15,19,23,86,10,14,16,60,null,7,9,26],
[21,25,29,98,null,null,22,84,9,13,15,55,3,6,8,22],
[20,24,28,96,null,null,21,82,8,12,14,50,null,5,7,20],
[19,23,27,94,14,18,20,80,7,11,13,45,2,4,6,16],
[18,22,26,92,13,17,19,75,6,10,12,40,null,3,5,12],
[17,21,25,90,12,16,18,70,5,9,11,35,1,2,4,8],
[16,20,24,88,11,15,17,65,4,8,10,30,null,null,null,null]
])
};
