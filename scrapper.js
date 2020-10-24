
const fetch=require("node-fetch");
const fs=require("fs");
const Excel = require('exceljs')


const raw_text= fs.readFileSync("people_names.txt",'utf-8');

const people_names=raw_text.split("#").map(name=>name.toLowerCase().replace(/\s+/g,'-'));



let workbook = new Excel.Workbook();
let worksheet = workbook.addWorksheet('data');
worksheet.columns = [
  {header: 'modalities', key: 'modalities'},
  {header: 'specialties', key: 'specialties'},
];



const run=async (names)=>{
    const allSpecialties = [];
    const allModalities = [];

    for(const name of names){
        const end_point = `https://api.wearemotivo.com/supervisors/slug/${name}`;
       try{
            const data = await fetch(end_point).then(res=>res.json());
            const {modalities,specialties}=data;
            const _modalities = modalities.reduce((ac, obj) => [...ac, obj.modality.name], []);
            const _specialties = specialties.reduce((ac, obj) => [...ac, obj.specialty.name], []);

            allModalities.push(..._modalities);
            allSpecialties.push(..._specialties);

        }catch(err){
           //dont care
       }
    }

    let i=0;
    while(i<allSpecialties.length && i<allModalities.length){
        worksheet.addRow({
            specialties:allSpecialties[i],
            modalities:allModalities[i]
        });
        i++;
    }
    while(i<allSpecialties.length){
        worksheet.addRow({
            specialties: allSpecialties[i]
        });
        i++;
    }
    while(i<allModalities.length){
        worksheet.addRow({
           modalities: allModalities[i]
        });
        i++;
    }

    workbook.xlsx.writeFile('data.xlsx')
}



run(people_names);




