export const categories = [
{
slug:"india",
label:"India",
labelHi:"भारत"
},
{
slug:"world",
label:"World",
labelHi:"विश्व"
},
{
slug:"politics",
label:"Politics",
labelHi:"राजनीति"
},
{
slug:"business",
label:"Business",
labelHi:"व्यापार"
},
{
slug:"technology",
label:"Technology",
labelHi:"तकनीक"
},
{
slug:"sports",
label:"Sports",
labelHi:"खेल"
},
{
slug:"entertainment",
label:"Entertainment",
labelHi:"मनोरंजन"
},
{
slug:"health",
label:"Health",
labelHi:"स्वास्थ्य"
},
{
slug:"explainers",
label:"Explainers",
labelHi:"व्याख्या"
}
];


export function getCategoryLabel(slug:string){

return categories.find(
(c)=>c.slug===slug
)?.label ?? slug;

}
