import {describe,it,expect} from 'vitest';
import {getResultInputConfig,parseOfficialResult} from './result-input';
describe('official result input parsing',()=>{
 it('converts minute-second input without rounding',()=>{expect(parseOfficialResult(13,'3:00')).toBe(180);expect(parseOfficialResult(43,'23:00')).toBe(1380);expect(parseOfficialResult(59,'14:00')).toBe(840);});
 it('rejects malformed clock values',()=>{expect(parseOfficialResult(13,'3:60')).toBeNaN();expect(parseOfficialResult(13,'180')).toBeNaN();expect(parseOfficialResult(13,'1:5')).toBeNaN();});
 it('accepts decimal-comma values exactly',()=>{expect(parseOfficialResult(20,'30,3')).toBe(30.3);expect(parseOfficialResult(39,'15,5')).toBe(15.5);});
 it('exposes correct input modes',()=>{expect(getResultInputConfig(65).kind).toBe('variant');expect(getResultInputConfig(69).kind).toBe('hits');expect(getResultInputConfig(68).kind).toBe('distance');});
});