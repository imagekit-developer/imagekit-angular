echo "$PWD"
if [[ -e ./node_modules/@types/node/index.d.ts ]]
then
sed -i "" "20 s/\/\/\//\/\//" ./node_modules/@types/node/index.d.ts
fi

if [[ -e ./node_modules/imagekit-javascript/dist/src/interfaces/index.d.ts ]]
then
sed -i "" "6 s/export type/export/" ./node_modules/imagekit-javascript/dist/src/interfaces/index.d.ts
fi