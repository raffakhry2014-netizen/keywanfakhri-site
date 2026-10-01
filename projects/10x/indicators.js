// Explanatory presentation only. The scoring engine remains in model.js unchanged.
export const indicatorGroups=[
 ['growth',25,['revGrowth','growthAccel','marketShare']],
 ['unit',20,['grossMargin','gmTrend','opLeverage']],
 ['surv',20,['fcfPositive','runwayMonths','shareGrowth','buybackVerified','debtLevel']],
 ['people',15,['insiderOwn','founderLed','insiderBuying','instOwn']],
 ['cat',15,['megatrend','catalyst','moat']],
 ['val',5,['evSales']],
 ['gates',null,['marketCapM','advK','tamAnnualM','ret2y','de']],
 ['risks',null,['x_goingConcern','x_serialDilution','x_reverseSplit','x_customerConc','x_auditorChange','x_otcShell','x_lumpyRevenue']]
];
const tables={
revGrowth:[[[0,0],[15,3],[30,7],[50,11],[80,14]],15],growthAccel:[[[-10,0],[0,2],[10,5]],6],marketShare:[[[1,4],[5,3],[15,2]],0],grossMargin:[[[20,0],[35,3],[50,6],[70,9]],10],gmTrend:[[[-2,0],[0,2],[3,4]],5],opLeverage:[[[0,0],[10,3]],5],runwayMonths:[[[12,0],[18,2],[24,5],[36,7]],9],shareGrowth:[[[2,8],[5,6],[10,3],[20,1]],0],insiderOwn:[[[5,0],[10,3],[20,5]],6],instOwn:[[[5,2],[30,2],[60,1]],0],evSales:[[[1,5],[2,4],[4,2.5],[8,1]],0]
};
function bands([table,fallback]){return table.map(([limit,pts],i)=>(i?table[i-1][0]+' ≤ x < ': 'x < ')+limit+' → '+pts).concat('x ≥ '+table.at(-1)[0]+' → '+fallback)}
export function renderIndicators(dict,node,rows,showNumber){
 const root=document.getElementById('indicator-groups');root.replaceChildren();
 const category=(pairs)=>pairs.map(([k,v])=>dict[k]+' → '+v);
 for(const [group,weight,fields] of indicatorGroups){
 const card=node('article',undefined,'indicator-group');const header=node('div',undefined,'indicator-head');header.append(node('h3',dict[group]));if(weight!==null)header.append(node('bdi',weight+' / 100','weight'));card.append(header);
 if(group==='risks')card.append(node('p',dict.riskNote,'group-note'));
 for(const field of fields){
 const item=node('div',undefined,'indicator'),heading=node('h4',dict[field]);item.dataset.indicator=field;item.append(heading);
 let rules=tables[field]?bands(tables[field]):[];
 if(field==='fcfPositive')rules=category([['yes',10]]).concat(dict.no+' → '+dict.runwayMonths);
 if(field==='runwayMonths')item.append(node('p',dict.fcfPositive+' = '+dict.no,'condition'));
 if(field==='shareGrowth')item.append(node('p','x < 0 → '+dict.buybackVerified+' = '+dict.yes,'condition'));
 if(field==='buybackVerified')rules=[dict.context];
 if(field==='debtLevel')rules=category([['none',2],['low',1],['high',0]]);
 if(field==='founderLed')rules=category([['yes',4],['no',0]]);
 if(field==='insiderBuying')rules=category([['yes',3],['no',0]]);
 if(field==='megatrend')rules=category([['strong',6],['moderate',3],['none',0]]);
 if(field==='catalyst')rules=category([['dated',6],['likely',3],['vague',0]]);
 if(field==='moat')rules=category([['strong',3],['some',1.5],['none',0]]);
 if(field==='evSales')item.append(node('p','x = (EV / Sales) ÷ (max('+dict.revGrowth+', 1) / 10)','condition formula'));
 if(field==='marketCapM')rules=['x > 10000 → ×0.30','5000 < x ≤ 10000 → ×0.60','2000 < x ≤ 5000 → ×0.85','50 ≤ x ≤ 2000 → ×1','0 < x < 50 → ×0.90'];
 if(field==='advK')rules=['x < 300 → ×0.80','x ≥ 300 → ×1'];
 if(field==='tamAnnualM')rules=[dict.formula+':',dict.tamAnnualM+' × ('+dict.share+' / 100) × ('+dict.margin+' / 100) × '+dict.multiple+' ÷ '+dict.marketCapM,dict.ceiling+' < 4× → '+dict.fail];
 if(field==='ret2y'||field==='de')rules=[dict.context];
 if(field.startsWith('x_'))rules=[dict.yes+' → −7'];
 const list=node('ul',undefined,'rule-list');for(const text of rules){const li=node('li',text);if(tables[field]||field==='marketCapM'||field==='advK')li.dir='ltr';list.append(li)}item.append(list);card.append(item);
 }
 root.append(card);
 }
 const table=document.getElementById('comparison');table.replaceChildren();const head=node('thead'),hr=node('tr');const corner=node('th',dict.inputs);corner.scope='col';hr.append(corner);for(const row of rows){const th=node('th',row.ticker);th.scope='col';th.dir='ltr';hr.append(th)}head.append(hr);table.append(head);const body=node('tbody');
 for(const [group,,fields] of indicatorGroups){const separator=node('tr',undefined,'table-group'),title=node('th',dict[group]);title.colSpan=4;separator.append(title);body.append(separator);for(const k of fields){const tr=node('tr'),th=node('th',dict[k]);th.scope='row';tr.append(th);for(const row of rows){let v=row[k];const val=v===null||v===undefined?dict.missing:typeof v==='boolean'?dict[v?'yes':'no']:typeof v==='number'?showNumber(v):(dict[v]||v);const td=node('td',val);if(typeof v==='number')td.dir='ltr';tr.append(td)}body.append(tr)}}table.append(body);
}
