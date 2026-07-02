import { useState, useMemo, useEffect } from "react";

const GRADE_POINTS = {"A":12,"A-":11,"B+":10,"B":9,"B-":8,"C+":7,"C":6,"C-":5,"D+":4,"D":3,"D-":2,"E":1};
const ALL_GRADES = ["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"];

const SUBJECTS = {
  "Languages & Maths": ["English","Kiswahili","Mathematics (Alt A)","Mathematics (Alt B)"],
  "Sciences": ["Biology","Physics","Chemistry","General Science"],
  "Humanities & Technical": ["History & Government","Geography","CRE","IRE","HRE","Home Science","Art & Design","Agriculture","Woodwork","Metalwork","Building & Construction","Power Mechanics","Electricity","Drawing & Design","Business Studies"],
  "Applied & Languages": ["French","German","Arabic","Music","Computer Studies","Entrepreneurship"],
};

const KUCCPS_DATES = [
  {label:"1st Application Window",date:"Apr 7 – May 6, 2026",done:true},
  {label:"Revision Window",date:"May 16 – May 22, 2026",done:true},
  {label:"Final Extended Deadline",date:"June 1, 2026",done:true},
  {label:"TVET & KMTC Deadline",date:"June 8, 2026",done:true},
  {label:"📌 Placement Results",date:"July 2026",done:false},
  {label:"📌 University Admissions Begin",date:"Late August 2026",done:false},
];

const DEG_CLUSTERS = [
  {id:"D1",name:"Engineering & Technology",icon:"⚙️",color:"#1565C0",desc:"Civil, Mechanical, Electrical, Software, Chemical, Mechatronics",meanMin:7,cutoff:42,
   mandatory:{"Mathematics (Alt A)":"C","Mathematics (Alt B)":"C","Physics":"C"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Physics"],["Chemistry","Biology","Geography","Computer Studies"]],
   fees:{gov:"Ksh 60,000–150,000/yr",self:"Ksh 200,000–400,000/yr",duration:"4–5 years"},
   progs:[
     {name:"BSc Civil Engineering",unis:["University of Nairobi ~44.5","JKUAT ~43.8","Dedan Kimathi University of Technology ~40.2","Moi University ~38.9","Technical University of Kenya (TUK) ~37.5","Technical University of Mombasa (TUM) ~36.8","Masinde Muliro University ~36.2","Kabarak University ~35.1","Murang'a University of Technology ~34.5","Pan Africa University ~43.0","Maseno University ~34.1"]},
     {name:"BSc Mechanical Engineering",unis:["University of Nairobi ~43.2","JKUAT ~42.6","Dedan Kimathi University of Technology ~39.8","Moi University ~37.5","Technical University of Kenya (TUK) ~37.1","Technical University of Mombasa (TUM) ~36.5","Masinde Muliro University ~35.8","Kabarak University ~34.2","Murang'a University of Technology ~33.8"]},
     {name:"BSc Electrical & Electronics Engineering",unis:["University of Nairobi ~44.1","JKUAT ~43.0","Dedan Kimathi University of Technology ~40.7","Kenyatta University ~38.2","Technical University of Kenya (TUK) ~37.8","Technical University of Mombasa (TUM) ~36.2","Masinde Muliro University ~35.5","Murang'a University of Technology ~34.1","Kibabii University ~32.5"]},
     {name:"BSc Software Engineering",unis:["JKUAT ~41.5","Strathmore University ~40.3","Dedan Kimathi University of Technology ~38.2","KCA University ~36.2","Technical University of Kenya (TUK) ~35.8","Zetech University ~32.1","Kabarak University ~34.5","Mount Kenya University ~30.5","Multimedia University of Kenya ~33.5"]},
     {name:"BSc Chemical Engineering",unis:["University of Nairobi ~43.7","JKUAT ~41.9","Moi University ~38.4","Technical University of Mombasa (TUM) ~37.1","Egerton University ~36.5"]},
     {name:"BSc Mechatronics Engineering",unis:["JKUAT ~42.2","Dedan Kimathi University of Technology ~40.5","Technical University of Kenya (TUK) ~38.1","Moi University ~37.8","Masinde Muliro University ~35.2"]},
     {name:"BSc Telecommunication Engineering",unis:["University of Nairobi ~42.5","JKUAT ~41.2","Dedan Kimathi University of Technology ~39.5","Technical University of Kenya (TUK) ~36.8","Technical University of Mombasa (TUM) ~35.5"]},
   ]},
  {id:"D2",name:"Medicine & Health Sciences",icon:"🏥",color:"#B71C1C",desc:"Medicine, Nursing, Pharmacy, Physiotherapy, Public Health",meanMin:9,cutoff:45,
   mandatory:{"Biology":"B-","Chemistry":"B-"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Physics"],["Biology"],["Chemistry"]],
   fees:{gov:"Ksh 80,000–200,000/yr",self:"Ksh 300,000–600,000/yr",duration:"5–6 years (MBChB)"},
   progs:[
     {name:"MBChB Medicine & Surgery",unis:["University of Nairobi ~47.8","Moi University ~46.5","Kenyatta University ~46.1","Egerton University ~45.3","Maseno University ~45.5","Aga Khan University ~47.0","Mount Kenya University ~44.5","Kabarak University ~44.2"]},
     {name:"Bachelor of Pharmacy",unis:["University of Nairobi ~45.6","JKUAT ~44.1","Kenyatta University ~43.8","Moi University ~42.5","Maseno University ~42.1","Meru University of Science & Technology ~40.8","Mount Kenya University ~39.5","Kenya Methodist University ~38.8","Egerton University ~41.2"]},
     {name:"BSc Nursing",unis:["University of Nairobi ~44.2","Kenyatta University ~43.5","Moi University ~42.8","Aga Khan University ~44.0","JKUAT ~42.5","Masinde Muliro University ~40.1","Kenya Methodist University ~39.8","Mount Kenya University ~38.5","Catholic University of Eastern Africa ~38.2","Jaramogi Oginga Odinga University ~37.8","Kisii University ~37.2","Rongo University ~36.5","University of Eastern Africa Baraton ~36.8"]},
     {name:"BSc Medical Laboratory Sciences",unis:["Kenyatta University ~42.3","JKUAT ~41.5","Moi University ~40.7","Maseno University ~38.9","Meru University of Science & Technology ~38.2","Masinde Muliro University ~37.5","Mount Kenya University ~36.8","Kisii University ~36.2","Kenya Methodist University ~36.5","Egerton University ~39.2"]},
     {name:"BSc Physiotherapy",unis:["University of Nairobi ~43.0","Kenyatta University ~42.1","Moi University ~41.3","JKUAT ~40.8","Kenya Methodist University ~38.5","Masinde Muliro University ~37.2"]},
     {name:"BSc Public Health",unis:["Kenyatta University ~40.5","Moi University ~39.8","JKUAT ~39.2","Maseno University ~37.5","Egerton University ~38.1","Masinde Muliro University ~36.8","South Eastern Kenya University ~35.2","Pwani University ~34.8","Jaramogi Oginga Odinga University ~35.1","Rongo University ~33.5","Kibabii University ~33.1","Chuka University ~32.8","Tom Mboya University ~32.5","University of Kabianga ~31.8"]},
     {name:"BSc Radiography",unis:["University of Nairobi ~42.8","Kenyatta University ~41.5","Moi University ~40.2","Maseno University ~39.1"]},
     {name:"BSc Nutrition & Dietetics",unis:["Kenyatta University ~39.5","JKUAT ~38.8","Maseno University ~36.5","Moi University ~37.2","Egerton University ~37.8","Masinde Muliro University ~35.1","University of Embu ~34.5"]},
   ]},
  {id:"D3",name:"Computing & IT",icon:"💻",color:"#006064",desc:"Computer Science, IT, Data Science, Cybersecurity, AI",meanMin:7,cutoff:38,
   mandatory:{"Mathematics (Alt A)":"C","Mathematics (Alt B)":"C"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Physics","Chemistry","Computer Studies","Geography"],["Physics","Chemistry","Computer Studies","Geography","Biology","Business Studies"]],
   fees:{gov:"Ksh 50,000–100,000/yr",self:"Ksh 150,000–300,000/yr",duration:"4 years"},
   progs:[
     {name:"BSc Computer Science",unis:["University of Nairobi ~40.5","Strathmore University ~39.8","JKUAT ~38.6","Kenyatta University ~36.2","Maseno University ~34.1","Moi University ~35.8","Dedan Kimathi University of Technology ~37.2","Technical University of Kenya (TUK) ~35.5","Masinde Muliro University ~33.8","Kisii University ~32.5","Catholic University of Eastern Africa ~34.5","Kabarak University ~33.2","Jaramogi Oginga Odinga University ~32.1","Multimedia University of Kenya ~33.5","Mount Kenya University ~30.5","Africa Nazarene University ~31.5","Kibabii University ~30.8","University of Eastern Africa Baraton ~29.5"]},
     {name:"BSc Information Technology",unis:["JKUAT ~37.4","KCA University ~34.1","Multimedia University of Kenya ~33.5","Zetech University ~30.2","Kenyatta University ~35.8","Moi University ~34.5","Technical University of Kenya (TUK) ~35.1","Technical University of Mombasa (TUM) ~33.8","University of Embu ~31.5","Chuka University ~30.8","Kibabii University ~31.2","Pwani University ~30.5","Rongo University ~29.8","Machakos University ~30.1","Karatina University ~29.5","Pioneer International University ~32.5","Murang'a University of Technology ~31.8","Garissa University ~28.5","Alupe University ~28.8","Great Lakes University of Kisumu ~29.2","Tom Mboya University ~28.5","South Eastern Kenya University ~29.2","Taita Taveta University ~28.8","Laikipia University ~28.5"]},
     {name:"BSc Data Science & Analytics",unis:["Strathmore University ~40.1","University of Nairobi ~39.5","JKUAT ~37.2","Dedan Kimathi University of Technology ~36.5","Kenyatta University ~35.8","Technical University of Kenya (TUK) ~34.5","Multimedia University of Kenya ~33.5"]},
     {name:"BSc Cybersecurity",unis:["Strathmore University ~39.2","JKUAT ~37.5","Dedan Kimathi University of Technology ~36.1","Technical University of Kenya (TUK) ~35.2","Kabarak University ~34.1","Multimedia University of Kenya ~33.8"]},
     {name:"BSc Information Systems",unis:["Kenyatta University ~36.5","Maseno University ~34.1","Egerton University ~35.2","USIU-Africa ~37.8","Daystar University ~35.1","Africa Nazarene University ~33.5","Scott Christian University ~29.5","St. Paul's University ~31.5","Presbyterian University of East Africa ~30.8"]},
     {name:"BSc Software Development",unis:["JKUAT ~38.1","Strathmore University ~39.5","KCA University ~35.2","Zetech University ~31.5","Pioneer International University ~33.2","Mount Kenya University ~30.8","Cooperative University of Kenya ~31.8","Kabarak University ~33.5"]},
   ]},
  {id:"D4",name:"Business & Economics",icon:"📊",color:"#E65100",desc:"Commerce, Economics, Finance, Accounting, HRM, Actuarial Science",meanMin:7,cutoff:36,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Business Studies","Entrepreneurship","Geography","History & Government"],["Business Studies","Geography","History & Government","Computer Studies"]],
   fees:{gov:"Ksh 40,000–80,000/yr",self:"Ksh 100,000–250,000/yr",duration:"4 years"},
   progs:[
     {name:"Bachelor of Commerce",unis:["University of Nairobi ~38.5","Kenyatta University ~36.8","Strathmore University ~37.2","Egerton University ~34.1","Mount Kenya University ~28.3","USIU-Africa ~37.5","KCA University ~33.2","Moi University ~35.5","JKUAT ~35.1","Maseno University ~33.8","Kisii University ~30.5","Masinde Muliro University ~31.2","Kenya Methodist University ~32.5","Kabarak University ~32.1","Catholic University of Eastern Africa ~33.8","Daystar University ~34.5","Africa Nazarene University ~31.5","Scott Christian University ~28.5","Jaramogi Oginga Odinga University ~30.2","Rongo University ~28.8","Machakos University ~29.5","University of Embu ~30.1","Chuka University ~29.8","Karatina University ~29.2","Laikipia University ~28.5","Cooperative University of Kenya ~31.5","Pioneer International University ~30.5","Zetech University ~27.5","Kibabii University ~29.8","Murang'a University of Technology ~29.1","South Eastern Kenya University ~28.8","Tom Mboya University ~27.5","Great Lakes University of Kisumu ~28.2","University of Kabianga ~28.5","Alupe University ~27.8","Presbyterian University of East Africa ~29.5","St. Paul's University ~30.2","Adventist University of Africa ~28.5","University of Eastern Africa Baraton ~28.1","Pan Africa Christian University ~29.8"]},
     {name:"BSc Accounting & Finance",unis:["Strathmore University ~38.1","KCA University ~34.5","USIU-Africa ~36.2","Kabarak University ~32.1","Kenyatta University ~36.5","JKUAT ~35.8","Moi University ~34.2","Cooperative University of Kenya ~32.5","Africa Nazarene University ~31.8","Kenya Methodist University ~32.8","Mount Kenya University ~29.5","Maseno University ~33.2","Egerton University ~34.5"]},
     {name:"BSc Economics",unis:["University of Nairobi ~39.2","Kenyatta University ~37.5","Egerton University ~35.1","Maseno University ~33.2","Moi University ~36.1","USIU-Africa ~38.5","Kabarak University ~33.5","Great Lakes University of Kisumu ~29.5","Jaramogi Oginga Odinga University ~31.2","Masinde Muliro University ~32.5"]},
     {name:"BSc Actuarial Science",unis:["University of Nairobi ~41.2","Kenyatta University ~38.5","JKUAT ~35.8","Kisii University ~30.1","Maseno University ~32.5","Strathmore University ~40.8","Technical University of Kenya (TUK) ~33.5"]},
     {name:"BSc Human Resource Management",unis:["Kenyatta University ~35.5","Moi University ~34.2","Mount Kenya University ~28.5","Masinde Muliro University ~30.5","Kenya Methodist University ~31.8","Daystar University ~33.5","JKUAT ~34.8","Africa Nazarene University ~30.2","Kabarak University ~31.5","University of Eastern Africa Baraton ~28.8"]},
     {name:"BSc Supply Chain & Procurement",unis:["Kenyatta University ~34.8","Moi University ~33.5","JKUAT ~34.1","Maseno University ~32.1","Cooperative University of Kenya ~31.8","Mount Kenya University ~28.1","Egerton University ~33.8"]},
   ]},
  {id:"D5",name:"Law",icon:"⚖️",color:"#263238",desc:"Bachelor of Laws (LLB)",meanMin:7,cutoff:44,
   mandatory:{"English":"C+"},
   slots:[["English"],["Kiswahili","History & Government","CRE","IRE","Mathematics (Alt A)","Mathematics (Alt B)"],["History & Government","CRE","IRE","Geography","Business Studies"],["History & Government","CRE","IRE","Geography","Business Studies","French","German","Arabic"]],
   fees:{gov:"Ksh 50,000–90,000/yr",self:"Ksh 150,000–350,000/yr",duration:"4 years"},
   progs:[{name:"Bachelor of Laws (LLB)",unis:["University of Nairobi ~46.2","Kenyatta University ~45.1","Moi University ~44.6","Strathmore University ~45.8","Mount Kenya University ~42.1","Kabarak University ~41.5","Catholic University of Eastern Africa ~43.2","USIU-Africa ~44.5","Africa Nazarene University ~41.8","Daystar University ~43.5","Pioneer International University ~40.5","Kenya Methodist University ~40.8","St. Paul's University ~40.1","Great Lakes University of Kisumu ~38.5","Adventist University of Africa ~39.2","Presbyterian University of East Africa ~39.8"]}]},
  {id:"D6",name:"Architecture & Built Environment",icon:"🏗️",color:"#4A148C",desc:"Architecture, Quantity Surveying, Urban Planning, Land Economics, Real Estate",meanMin:7,cutoff:38,
   mandatory:{"Mathematics (Alt A)":"C","Mathematics (Alt B)":"C"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Physics","Building & Construction","Drawing & Design"],["Chemistry","Geography","Art & Design","Biology"]],
   fees:{gov:"Ksh 50,000–110,000/yr",self:"Ksh 150,000–300,000/yr",duration:"5 years (Architecture)"},
   progs:[
     {name:"Bachelor of Architecture",unis:["University of Nairobi ~41.2","JKUAT ~40.0","Technical University of Kenya (TUK) ~37.5","Maseno University ~36.2","Moi University ~35.8"]},
     {name:"BSc Quantity Surveying",unis:["University of Nairobi ~38.9","JKUAT ~37.4","Technical University of Kenya (TUK) ~34.2","Technical University of Mombasa (TUM) ~33.5","Maseno University ~33.1","Moi University ~34.5","Dedan Kimathi University of Technology ~35.8"]},
     {name:"BSc Land Economics",unis:["University of Nairobi ~39.5","Kenyatta University ~37.1","Moi University ~35.2","JKUAT ~36.8","Maseno University ~33.8","Technical University of Kenya (TUK) ~34.1"]},
     {name:"BSc Urban & Regional Planning",unis:["University of Nairobi ~38.0","JKUAT ~36.5","Technical University of Mombasa (TUM) ~33.2","Maseno University ~32.8","Egerton University ~33.5","Technical University of Kenya (TUK) ~34.8"]},
     {name:"BSc Real Estate",unis:["University of Nairobi ~37.5","JKUAT ~36.1","Technical University of Kenya (TUK) ~33.5","Maseno University ~32.1","Kabarak University ~31.5"]},
     {name:"BSc Construction Management",unis:["JKUAT ~38.5","Technical University of Kenya (TUK) ~36.2","Technical University of Mombasa (TUM) ~34.5","Maseno University ~33.2","Moi University ~34.8"]},
   ]},
  {id:"D7",name:"Education",icon:"📚",color:"#00695C",desc:"Education Arts, Education Science, Special Needs, Early Childhood, Technical Education",meanMin:7,cutoff:35,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Biology","Physics","Chemistry","History & Government","Geography"],["Mathematics (Alt A)","Mathematics (Alt B)","Biology","Physics","Chemistry","History & Government","Geography","CRE","IRE","Agriculture","Business Studies"],["Mathematics (Alt A)","Biology","Physics","Chemistry","History & Government","Geography","CRE","IRE","Home Science","Computer Studies","Music","Art & Design"]],
   fees:{gov:"Ksh 35,000–70,000/yr",self:"Ksh 80,000–180,000/yr",duration:"4 years"},
   progs:[
     {name:"BEd Arts",unis:["Kenyatta University ~36.2","Moi University ~35.5","Masinde Muliro University ~33.1","Maseno University ~32.8","Kisii University ~30.5","Egerton University ~34.2","University of Eldoret ~31.8","South Eastern Kenya University ~30.2","Chuka University ~29.8","Rongo University ~29.5","Pwani University ~29.1","Jaramogi Oginga Odinga University ~30.5","Catholic University of Eastern Africa ~32.5","Daystar University ~33.1","Africa Nazarene University ~31.2","Kenya Methodist University ~30.8","Scott Christian University ~28.5","Pan Africa Christian University ~29.2","Machakos University ~29.5","Laikipia University ~28.8","Kibabii University ~29.1","Tom Mboya University ~29.5","Taita Taveta University ~28.5","Garissa University ~28.1","Alupe University ~28.2","University of Eastern Africa Baraton ~28.5","University of Kabianga ~28.8","Maasai Mara University ~28.2","Murang'a University of Technology ~28.5","Bomet University College ~27.8","Tharaka University ~27.5"]},
     {name:"BEd Science",unis:["Kenyatta University ~37.1","Moi University ~36.4","Egerton University ~35.8","Masinde Muliro University ~33.8","Maseno University ~33.5","University of Eldoret ~32.5","South Eastern Kenya University ~31.2","Chuka University ~30.5","Rongo University ~30.1","Kibabii University ~30.5","Machakos University ~30.2","Jaramogi Oginga Odinga University ~31.5","Kisii University ~30.8","University of Embu ~30.5","Pwani University ~29.8","Laikipia University ~29.5"]},
     {name:"BEd Early Childhood & Primary",unis:["Kenyatta University ~33.5","Catholic University of Eastern Africa ~31.2","Mount Kenya University ~29.5","Africa Nazarene University ~30.8","Daystar University ~32.1","Kenya Methodist University ~30.2","Pwani University ~28.5","Taita Taveta University ~27.8","Garissa University ~27.5","Kibabii University ~28.5","Laikipia University ~28.2","Pan Africa Christian University ~29.1","Scott Christian University ~28.2","University of Eastern Africa Baraton ~27.8"]},
     {name:"BEd Special Needs Education",unis:["Kenyatta University ~33.1","Maseno University ~31.5","Moi University ~32.8","Africa Nazarene University ~30.5","University of Eldoret ~30.1"]},
     {name:"BEd Technical & Vocational",unis:["University of Eldoret ~32.5","Moi University ~33.2","Technical University of Kenya (TUK) ~31.5","Kenya Technical Trainers College (KTTC) ~30.8","Masinde Muliro University ~30.2"]},
   ]},
  {id:"D8",name:"Social Sciences & Arts",icon:"🎓",color:"#2E7D32",desc:"Sociology, Psychology, Political Science, International Relations, Criminology",meanMin:7,cutoff:34,
   mandatory:{},
   slots:[["English","Kiswahili"],["History & Government","Geography","CRE","IRE","Mathematics (Alt A)","Mathematics (Alt B)","Business Studies"],["History & Government","Geography","CRE","IRE","Mathematics (Alt A)","Biology","Business Studies"],["History & Government","Geography","CRE","IRE","French","German","Arabic","Music","Computer Studies"]],
   fees:{gov:"Ksh 35,000–65,000/yr",self:"Ksh 80,000–180,000/yr",duration:"4 years"},
   progs:[
     {name:"BA Sociology",unis:["University of Nairobi ~35.2","Kenyatta University ~34.8","Moi University ~33.1","Maseno University ~31.5","Egerton University ~32.8","USIU-Africa ~35.5","Catholic University of Eastern Africa ~32.5","Daystar University ~33.8","Masinde Muliro University ~30.5","Kisii University ~29.8","Jaramogi Oginga Odinga University ~29.5","Rongo University ~28.5","Tom Mboya University ~27.8","Pwani University ~28.5"]},
     {name:"BA Psychology",unis:["University of Nairobi ~36.1","Kenyatta University ~35.5","USIU-Africa ~36.8","Daystar University ~35.2","Catholic University of Eastern Africa ~33.8","Africa Nazarene University ~32.5","Maseno University ~32.1","Kenya Methodist University ~31.5","Strathmore University ~36.5","Pioneer International University ~31.2","Scott Christian University ~29.5","St. Paul's University ~30.8"]},
     {name:"BA Political Science & Government",unis:["University of Nairobi ~35.8","Kenyatta University ~34.2","Moi University ~32.5","Maseno University ~31.2","Jaramogi Oginga Odinga University ~30.1","Catholic University of Eastern Africa ~31.5","Daystar University ~32.8","Masinde Muliro University ~29.8"]},
     {name:"BA International Relations",unis:["University of Nairobi ~36.5","Kenyatta University ~35.1","USIU-Africa ~37.2","Moi University ~33.5","Daystar University ~34.5","Catholic University of Eastern Africa ~32.8","Maseno University ~31.5"]},
     {name:"BA Criminology & Security Studies",unis:["Kenyatta University ~34.5","Moi University ~33.2","Maseno University ~31.8","University of Nairobi ~35.1","Catholic University of Eastern Africa ~31.5","Daystar University ~32.2"]},
     {name:"BA Development Studies",unis:["Kenyatta University ~33.5","Maseno University ~31.2","Jaramogi Oginga Odinga University ~29.8","Tom Mboya University ~28.5","Kisii University ~29.2","Pwani University ~28.8","Taita Taveta University ~27.8","Rongo University ~28.5"]},
   ]},
  {id:"D9",name:"Agriculture & Natural Sciences",icon:"🌱",color:"#33691E",desc:"Agriculture, Food Science, Environmental Science, Fisheries, Forestry",meanMin:7,cutoff:36,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Biology","Agriculture"],["Biology","Chemistry","Physics","Agriculture","Geography"],["Biology","Chemistry","Physics","Agriculture","Geography","Mathematics (Alt A)"]],
   fees:{gov:"Ksh 40,000–80,000/yr",self:"Ksh 100,000–200,000/yr",duration:"4 years"},
   progs:[
     {name:"BSc Agriculture",unis:["Egerton University ~36.5","University of Nairobi ~37.8","Moi University ~35.2","Maseno University ~33.8","JKUAT ~36.1","Masinde Muliro University ~32.5","University of Embu ~31.8","Chuka University ~31.5","Pwani University ~30.8","South Eastern Kenya University ~30.5","Laikipia University ~29.8","Kibabii University ~30.1","Rongo University ~29.5","Tom Mboya University ~29.2","Taita Taveta University ~29.1","Maasai Mara University ~28.8","University of Kabianga ~29.5","Kabarak University ~31.2","Tharaka University ~27.8","Garissa University ~27.5","Alupe University ~27.8"]},
     {name:"BSc Food Science & Technology",unis:["JKUAT ~36.1","Egerton University ~35.4","University of Nairobi ~37.2","Kenyatta University ~34.8","Moi University ~34.2","Maseno University ~32.8","Masinde Muliro University ~31.5","University of Embu ~30.5"]},
     {name:"BSc Environmental Science",unis:["University of Nairobi ~36.5","Kenyatta University ~35.1","Maseno University ~32.8","Pwani University ~31.5","Taita Taveta University ~30.2","South Eastern Kenya University ~30.5","Maasai Mara University ~29.8","Jaramogi Oginga Odinga University ~30.5","Egerton University ~34.1","Laikipia University ~29.5"]},
     {name:"BSc Agribusiness Management",unis:["Egerton University ~34.8","Moi University ~33.5","Kisii University ~29.1","Maseno University ~31.2","University of Kabianga ~29.8","Kibabii University ~29.5","Laikipia University ~28.8","Rongo University ~28.5"]},
     {name:"BSc Fisheries & Aquatic Sciences",unis:["Maseno University ~32.5","Egerton University ~33.1","Tom Mboya University ~30.5","Jaramogi Oginga Odinga University ~31.2","Pwani University ~31.8","University of Nairobi ~33.5"]},
     {name:"BSc Forestry & Natural Resources",unis:["Egerton University ~34.5","University of Nairobi ~35.2","Moi University ~33.1","Maseno University ~31.8","Pwani University ~30.2"]},
     {name:"BSc Horticulture",unis:["Egerton University ~35.1","University of Nairobi ~36.2","Jomo Kenyatta University of Agriculture & Technology ~35.5","Maseno University ~32.5","University of Embu ~30.8","Chuka University ~30.2"]},
   ]},
  {id:"D10",name:"Pure & Mathematical Sciences",icon:"🔬",color:"#01579B",desc:"Mathematics, Physics, Statistics, Biochemistry, Chemistry, Biotechnology",meanMin:7,cutoff:40,
   mandatory:{"Mathematics (Alt A)":"B-","Mathematics (Alt B)":"B-"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Physics","Chemistry","Biology"],["Physics","Chemistry","Biology","Geography","Computer Studies"]],
   fees:{gov:"Ksh 40,000–80,000/yr",self:"Ksh 100,000–220,000/yr",duration:"4 years"},
   progs:[
     {name:"BSc Mathematics",unis:["University of Nairobi ~40.5","Kenyatta University ~39.1","Maseno University ~36.8","Egerton University ~37.5","Moi University ~37.2","JKUAT ~38.5","Masinde Muliro University ~34.5","Kisii University ~32.8","Catholic University of Eastern Africa ~35.1","Kabarak University ~34.2","Chuka University ~31.5","University of Embu ~31.8","South Eastern Kenya University ~30.5","Pwani University ~30.2","Jaramogi Oginga Odinga University ~31.1","Laikipia University ~29.8"]},
     {name:"BSc Statistics",unis:["University of Nairobi ~40.1","Kenyatta University ~38.8","Maseno University ~36.2","Egerton University ~37.1","Moi University ~36.8","JKUAT ~38.1","Masinde Muliro University ~34.1","Kisii University ~32.5","Technical University of Kenya (TUK) ~33.8"]},
     {name:"BSc Biochemistry",unis:["University of Nairobi ~40.5","Kenyatta University ~39.2","Maseno University ~37.1","Egerton University ~37.8","Moi University ~36.5","JKUAT ~38.2","Masinde Muliro University ~35.1","Pwani University ~31.5"]},
     {name:"BSc Biotechnology",unis:["JKUAT ~39.5","Kenyatta University ~38.8","Maseno University ~36.5","Moi University ~35.8","Egerton University ~36.2","Dedan Kimathi University of Technology ~35.5"]},
     {name:"BSc Physics",unis:["University of Nairobi ~40.2","Kenyatta University ~38.5","Maseno University ~36.5","Egerton University ~37.2","Moi University ~36.1","Masinde Muliro University ~33.8","South Eastern Kenya University ~30.8"]},
     {name:"BSc Chemistry",unis:["University of Nairobi ~39.8","Kenyatta University ~38.2","Maseno University ~36.1","Egerton University ~36.8","Moi University ~35.5","Masinde Muliro University ~33.5","University of Embu ~31.2"]},
   ]},
  {id:"D11",name:"Communication & Media",icon:"📺",color:"#AD1457",desc:"Journalism, Mass Communication, Film, Public Relations, Advertising",meanMin:7,cutoff:34,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","History & Government","Geography","Biology"],["History & Government","Geography","CRE","IRE","Business Studies","Biology","Computer Studies"],["History & Government","Geography","CRE","Business Studies","Music","Art & Design","Computer Studies"]],
   fees:{gov:"Ksh 40,000–75,000/yr",self:"Ksh 100,000–220,000/yr",duration:"4 years"},
   progs:[
     {name:"BA Communication & Journalism",unis:["University of Nairobi ~35.6","Daystar University ~34.5","USIU-Africa ~36.1","Moi University ~33.2","Kenyatta University ~34.8","Catholic University of Eastern Africa ~33.5","Kenya Methodist University ~32.1","Africa Nazarene University ~31.5","Maseno University ~30.8","Pan Africa Christian University ~31.2","Multimedia University of Kenya ~32.5","Mount Kenya University ~29.5","Scott Christian University ~28.5","Masinde Muliro University ~30.2","Kisii University ~29.5","Jaramogi Oginga Odinga University ~29.1"]},
     {name:"BSc Media Science & Film",unis:["Multimedia University of Kenya ~32.5","Kenyatta University ~34.1","Maseno University ~30.8","Moi University ~31.5","USIU-Africa ~35.2","Daystar University ~33.8","Kenya Institute of Mass Communication ~31.5"]},
     {name:"BA Public Relations & Advertising",unis:["USIU-Africa ~35.8","Daystar University ~33.5","Kenyatta University ~33.8","Mount Kenya University ~28.5","Catholic University of Eastern Africa ~32.5","Africa Nazarene University ~30.8"]},
     {name:"BA Linguistics & Literature",unis:["University of Nairobi ~34.5","Kenyatta University ~33.2","Moi University ~31.8","Maseno University ~30.2","Catholic University of Eastern Africa ~31.5","Daystar University ~32.1"]},
   ]},
  {id:"D12",name:"Veterinary Medicine",icon:"🐾",color:"#827717",desc:"Veterinary Medicine, Animal Health & Production",meanMin:8,cutoff:44,
   mandatory:{"Biology":"C+","Chemistry":"C+"},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Physics"],["Biology"],["Chemistry"]],
   fees:{gov:"Ksh 70,000–160,000/yr",self:"Ksh 250,000–500,000/yr",duration:"5 years"},
   progs:[
     {name:"Bachelor of Veterinary Medicine (BVM)",unis:["University of Nairobi ~46.5","Egerton University ~45.2","Moi University ~44.8"]},
     {name:"BSc Animal Health & Production",unis:["Egerton University ~38.5","University of Nairobi ~40.1","Moi University ~37.2","Maseno University ~35.8","University of Kabianga ~33.5","Maasai Mara University ~32.8","Laikipia University ~31.5","University of Embu ~31.2"]},
   ]},
  {id:"D13",name:"Tourism & Hospitality",icon:"✈️",color:"#F57F17",desc:"Tourism Management, Hotel Management, Events, Culinary Arts",meanMin:6,cutoff:32,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Biology","Geography","History & Government"],["Biology","Geography","History & Government","Business Studies","Home Science","Chemistry"],["Biology","Geography","Business Studies","Home Science","French","German","Computer Studies"]],
   fees:{gov:"Ksh 35,000–70,000/yr",self:"Ksh 80,000–180,000/yr",duration:"4 years"},
   progs:[
     {name:"BSc Travel & Tourism Management",unis:["Kenyatta University ~33.1","Moi University ~32.5","Mount Kenya University ~28.2","Maseno University ~30.8","Pwani University ~29.5","Taita Taveta University ~28.8","Technical University of Mombasa (TUM) ~30.5","Kisii University ~28.5","Maasai Mara University ~27.8","South Eastern Kenya University ~27.5","USIU-Africa ~34.2","Daystar University ~32.8"]},
     {name:"BSc Hospitality & Hotel Management",unis:["Kenyatta University ~32.8","Technical University of Mombasa (TUM) ~30.5","Mount Kenya University ~27.9","Pwani University ~29.1","Maseno University ~30.2","Tom Mboya University ~27.5","Jaramogi Oginga Odinga University ~27.8","USIU-Africa ~33.5"]},
     {name:"BSc Events Management",unis:["USIU-Africa ~33.5","Kenyatta University ~31.5","Technical University of Mombasa (TUM) ~29.8","Mount Kenya University ~27.2"]},
   ]},
  {id:"D14",name:"Fine Arts, Design & Music",icon:"🎨",color:"#6A1B9A",desc:"Fine Art, Graphic Design, Fashion, Music, Animation",meanMin:6,cutoff:30,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)","Art & Design","Music","History & Government"],["Art & Design","Music","Home Science","History & Government","Geography","Biology"],["Art & Design","Music","Home Science","Geography","CRE","Business Studies","Computer Studies"]],
   fees:{gov:"Ksh 35,000–65,000/yr",self:"Ksh 80,000–180,000/yr",duration:"4 years"},
   progs:[
     {name:"BA Fine Art",unis:["Kenyatta University ~29.5","Technical University of Kenya (TUK) ~27.8","Moi University ~27.5","University of Nairobi ~30.1","Maseno University ~26.8"]},
     {name:"BA Graphic Design",unis:["Technical University of Kenya (TUK) ~30.1","Kenyatta University ~29.8","Multimedia University of Kenya ~28.5","Moi University ~27.2","Mount Kenya University ~25.5","Maseno University ~26.5"]},
     {name:"Bachelor of Music",unis:["Kenyatta University ~28.5","University of Nairobi ~30.1","Africa Nazarene University ~27.5","Daystar University ~28.2","Catholic University of Eastern Africa ~27.8"]},
     {name:"BA Fashion Design & Clothing Technology",unis:["Technical University of Kenya (TUK) ~29.5","Kenyatta University ~28.8","Maseno University ~27.1","Moi University ~26.8"]},
     {name:"BSc Animation & Digital Media",unis:["Multimedia University of Kenya ~31.5","Technical University of Kenya (TUK) ~30.2","USIU-Africa ~33.5","Strathmore University ~34.1"]},
   ]},
  {id:"D15",name:"Geosciences & Environment",icon:"🌍",color:"#4E342E",desc:"Geology, Mining, Meteorology, Hydrology, Water Resources",meanMin:7,cutoff:36,
   mandatory:{},
   slots:[["English","Kiswahili"],["Mathematics (Alt A)","Mathematics (Alt B)"],["Physics","Chemistry","Geography","Biology"],["Physics","Chemistry","Geography","Biology","Agriculture"]],
   fees:{gov:"Ksh 45,000–85,000/yr",self:"Ksh 120,000–240,000/yr",duration:"4 years"},
   progs:[
     {name:"BSc Geology",unis:["University of Nairobi ~37.5","Maseno University ~34.2","South Eastern Kenya University ~30.5","Technical University of Kenya (TUK) ~33.8","Egerton University ~34.5","Taita Taveta University ~29.5"]},
     {name:"BSc Mining Engineering",unis:["University of Nairobi ~38.2","Technical University of Kenya (TUK) ~35.1","Dedan Kimathi University of Technology ~36.5","Taita Taveta University ~30.8"]},
     {name:"BSc Meteorology",unis:["University of Nairobi ~36.8","South Eastern Kenya University ~32.1","Technical University of Kenya (TUK) ~34.5","Maseno University ~31.5"]},
     {name:"BSc Water & Environmental Engineering",unis:["University of Nairobi ~37.5","JKUAT ~36.2","Technical University of Kenya (TUK) ~34.5","Egerton University ~35.1","Masinde Muliro University ~32.5","Pwani University ~30.8"]},
     {name:"BSc Geography & Resource Management",unis:["University of Nairobi ~36.2","Kenyatta University ~35.1","Maseno University ~32.8","Egerton University ~33.5","Moi University ~33.2","South Eastern Kenya University ~29.8","Pwani University ~29.5"]},
   ]},
];

const DIPLOMA_CLUSTERS = [
  {id:"L6-ENG",name:"Diploma — Engineering & Technology",icon:"⚙️",color:"#1565C0",note:"Min C− mean. D+ in Maths + Physics/Chemistry.",fees:"Ksh 10,000–30,000/yr",duration:"3 years",
   progs:["Diploma in Mechanical Engineering","Diploma in Civil Engineering","Diploma in Electrical & Electronics Engineering","Diploma in Automotive Engineering","Diploma in Telecommunications","Diploma in Building Technology","Diploma in Plumbing Technology","Diploma in Chemical Engineering","Diploma in Refrigeration & Air Conditioning","Diploma in Petroleum Engineering"],
   unis:["Technical University of Kenya (TUK)","Technical University of Mombasa (TUM)","Rift Valley Technical Training Institute – Eldoret","Sigalagala National Polytechnic – Kakamega","Kenya Technical Trainers College (KTTC) – Nairobi","Meru National Polytechnic","Kisumu Polytechnic","Nairobi Technical Training Institute (NTTI)","Eldoret Technical Training Institute","Nakuru Technical Training Institute","Thika Technical Training Institute","Bumbe Technical Training Institute – Busia","Kabete National Polytechnic – Nairobi","Kamuthe Technical Training Institute – Embu","Karen Technical Training Institute – Nairobi","Bandari College – Mombasa","Coast Institute of Technology – Mombasa","Kenya Railways Training Institute – Nairobi","Kitale Technical Training Institute","Kisii Technical Training Institute","Embu Technical Training Institute","Nyeri National Polytechnic","Mombasa Technical Training Institute","Machakos Technical Training Institute","Garissa Technical Training Institute","Kakamega Technical Training Institute"]},
  {id:"L6-HEALTH",name:"Diploma — Health Sciences (KMTC)",icon:"🏥",color:"#B71C1C",note:"Min C− mean. Biology + Chemistry at D+. 78 KMTC campuses nationwide.",fees:"Ksh 10,000–30,000/yr",duration:"3 years",
   progs:["Diploma in Clinical Medicine & Surgery","Diploma in Kenya Registered Community Health Nursing (KRCHN)","Diploma in Pharmacy Technology","Diploma in Medical Laboratory Sciences","Diploma in Nutrition & Dietetics","Diploma in Radiography","Diploma in Physiotherapy","Diploma in Occupational Therapy","Diploma in Orthopaedic Technology","Diploma in Dental Technology","Diploma in Ophthalmology","Diploma in Health Records & Information Management","Diploma in Medical Engineering Technology"],
   unis:["KMTC – Nairobi","KMTC – Mombasa (Coast General)","KMTC – Kisumu","KMTC – Nakuru","KMTC – Eldoret","KMTC – Nyeri","KMTC – Embu","KMTC – Kakamega","KMTC – Garissa","KMTC – Kisii","KMTC – Siaya","KMTC – Homa Bay","KMTC – Busia","KMTC – Vihiga","KMTC – Kitale","KMTC – Bungoma","KMTC – Machakos","KMTC – Thika","KMTC – Meru","KMTC – Chuka","KMTC – Isiolo","KMTC – Marsabit","KMTC – Wajir","KMTC – Mandera","KMTC – Turkana (Lodwar)","KMTC – Samburu (Maralal)","KMTC – Laikipia (Nanyuki)","KMTC – Baringo (Kabarnet)","KMTC – Bomet","KMTC – Kericho","KMTC – Narok","KMTC – Kajiado","KMTC – Makueni","KMTC – Kilifi","KMTC – Kwale","KMTC – Taita Taveta (Voi)","KMTC – Lamu","KMTC – Tana River (Hola)","KMTC – Migori","KMTC – Nyamira","KMTC – Nandi (Kapsabet)","KMTC – Uasin Gishu (Burnt Forest)","KMTC – Nyandarua (Ol Kalou)","KMTC – Murang'a","KMTC – Kirinyaga (Kerugoya)","KMTC – West Pokot (Kapenguria)","KMTC – Trans-Nzoia (Kiminini)","KMTC – Elgeyo Marakwet (Iten)","KMTC – Kwale (Shimba Hills)","KMTC – Mombasa Annex","KMTC – Nairobi Women's Hospital affiliate","KMTC – Kisumu East","KMTC – Kakamega – Shieywe","KMTC – Mt. Elgon"]},
  {id:"L6-IT",name:"Diploma — ICT & Computing",icon:"💻",color:"#006064",note:"Min C− mean. D+ in Maths.",fees:"Ksh 10,000–25,000/yr",duration:"3 years",
   progs:["Diploma in Information Technology","Diploma in Computer Studies","Diploma in Cybersecurity","Diploma in Software Development","Diploma in Data Management","Diploma in Network Administration","Diploma in ICT Technical Support"],
   unis:["Technical University of Kenya (TUK)","Technical University of Mombasa (TUM)","Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute","Sigalagala National Polytechnic","Kisumu Polytechnic","Meru National Polytechnic","Nakuru Technical Training Institute","Thika Technical Training Institute","Nyeri National Polytechnic","Kabete National Polytechnic","Kenya Institute of Mass Communication (KIMC)","Multimedia University of Kenya","Mount Kenya University","Zetech University","Pioneer International University","KCA University","Kabete National Polytechnic","Eldoret Technical Training Institute","Kisii Technical Training Institute","Machakos Technical Training Institute"]},
  {id:"L6-BIZ",name:"Diploma — Business & Finance",icon:"📊",color:"#E65100",note:"Min C− mean.",fees:"Ksh 10,000–25,000/yr",duration:"3 years",
   progs:["Diploma in Business Management","Diploma in Accounting","Diploma in Banking & Finance","Diploma in Human Resource Management","Diploma in Sales & Marketing","Diploma in Purchasing & Supply Chain","Diploma in Project Management","Diploma in Cooperative Management","Diploma in Entrepreneurship"],
   unis:["Technical University of Kenya (TUK)","Kenya National Polytechnic – Nairobi","Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute","Sigalagala National Polytechnic","Kisumu Polytechnic","Meru National Polytechnic","Cooperative University of Kenya","Kenya Institute of Management (KIM)","Kenya School of Government","Nakuru Technical Training Institute","Thika Technical Training Institute","KCA University","Kenya Methodist University","Mount Kenya University","Zetech University","Pioneer International University","Bumbe Technical Training Institute","Kisii Technical Training Institute","Machakos Technical Training Institute","Eldoret Technical Training Institute","Embu Technical Training Institute","Garissa Technical Training Institute"]},
  {id:"L6-EDUC",name:"Diploma — Teacher Education (TTCs)",icon:"📚",color:"#00695C",note:"Min C mean for Primary (P1). C+ in English required.",fees:"Ksh 15,000–35,000/yr",duration:"2 years",
   progs:["Diploma in Primary Teacher Education (P1)","Diploma in Special Needs Education","Diploma in Early Childhood Development & Education (ECDE)"],
   unis:["Highridge TTC – Nairobi","Kagumo TTC – Nyeri","Thogoto TTC – Kiambu","Kilimambogo TTC – Thika","Eregi TTC – Kakamega","Mosoriot TTC – Nandi","Tambach TTC – Elgeyo Marakwet","Baringo TTC – Kabarnet","Eldoret TTC – Uasin Gishu","Nakuru TTC","Kisumu TTC","Migori TTC","Kisii TTC","Homa Bay TTC","Machakos TTC","Kitui TTC","Meru TTC","Embu TTC","Giakanja TTC – Nyeri","Kericho TTC","Garissa TTC","Malindi TTC","Shanzu TTC – Mombasa","Murang'a TTC","Kamwenja TTC – Nyeri","Asumbi TTC – Homa Bay","Lugulu TTC – Bungoma","Matungu TTC – Kakamega","Siriba TTC – Siaya","Bomet TTC","Narok TTC","Kajiado TTC","Kibwezi TTC – Makueni","Voi TTC – Taita Taveta","Kilifi TTC","Kwale TTC","Lamu TTC","Marsabit TTC","Lodwar TTC – Turkana","Maralal TTC – Samburu","Nanyuki TTC – Laikipia","Iten TTC – Elgeyo Marakwet","Kapenguria TTC – West Pokot","Bungoma TTC","Kakamega TTC"]},
  {id:"L6-AGRI",name:"Diploma — Agriculture & Natural Resources",icon:"🌱",color:"#33691E",note:"Min C− mean. Biology recommended.",fees:"Ksh 10,000–25,000/yr",duration:"3 years",
   progs:["Diploma in Agriculture","Diploma in Horticulture","Diploma in Animal Health & Production","Diploma in Food Processing Technology","Diploma in Fisheries Management","Diploma in Agricultural Engineering","Diploma in Farm Management","Diploma in Cooperative Management","Diploma in Forestry"],
   unis:["Bukura Agricultural College – Kakamega","KATC – Naivasha (Kenya Agricultural Training Centre)","KATC – Embu","KATC – Kitale","KATC – Nakuru (Njoro)","KATC – Meru","KATC – Siakago – Embu","KATC – Ngong – Kajiado","KATC – Muhoroni – Kisumu","Rift Valley Technical (Animal Health section)","Egerton University TVET programmes","South Eastern Kenya University (affiliate TVET)","Pwani University (affiliate TVET)","Maasai Mara University (affiliate TVET)","University of Kabianga (affiliate TVET)","Laikipia University (affiliate TVET)","Taita Taveta University (affiliate TVET)","Rongo University (affiliate TVET)","Tom Mboya University (affiliate TVET)","Tharaka University (affiliate TVET)","Alupe University (affiliate TVET)"]},
  {id:"L6-HOSP",name:"Diploma — Tourism, Hospitality & Catering",icon:"✈️",color:"#F57F17",note:"Min C− mean. English proficiency required.",fees:"Ksh 10,000–25,000/yr",duration:"3 years",
   progs:["Diploma in Food & Beverage Management","Diploma in Hotel & Hospitality Management","Diploma in Tour Operations & Guiding","Diploma in Front Office Management","Diploma in Travel & Tourism","Diploma in Culinary Arts","Diploma in Events Management"],
   unis:["Kenya Utalii College – Nairobi","Kenya Utalii College – Mombasa (Utalii Mombasa)","Technical University of Mombasa (TUM)","Kisumu Polytechnic","Rift Valley Technical Training Institute","Nakuru Technical Training Institute","Kenya School of Hotel & Institutional Catering (SHIC)","Pwani University (affiliate)","Mount Kenya University","South Eastern Kenya University (affiliate)","Taita Taveta University (affiliate)","Maasai Mara University (affiliate)","Tom Mboya University (affiliate)","Bandari College – Mombasa","Kenya Wildlife Service Training Institute – Naivasha"]},
  {id:"L6-ART",name:"Diploma — Creative Arts & Media",icon:"🎨",color:"#6A1B9A",note:"Min C− mean. Portfolio may be required.",fees:"Ksh 10,000–25,000/yr",duration:"3 years",
   progs:["Diploma in Graphic Design","Diploma in Fashion Design & Clothing Technology","Diploma in Music Technology","Diploma in Interior Design","Diploma in Photography","Diploma in Film & Television Production","Diploma in Animation & Digital Media","Diploma in Performing Arts"],
   unis:["Technical University of Kenya (TUK)","Nairobi Technical Training Institute (NTTI)","Kabete National Polytechnic","Multimedia University of Kenya","Kenya Institute of Mass Communication (KIMC) – Nairobi","Kenyatta University (affiliate TVET)","Moi University (affiliate TVET)","Kisumu Polytechnic","Rift Valley Technical Training Institute","Nakuru Technical Training Institute","Thika Technical Training Institute","Coast Institute of Technology – Mombasa","Kisii Technical Training Institute"]},
];

const CRAFT_CLUSTERS = [
  {id:"L5-ENG",name:"Craft Cert — Engineering & Trades",icon:"🔧",color:"#37474F",note:"Min D mean. No strict subject requirements.",fees:"Ksh 5,000–15,000/yr",duration:"2 years",
   progs:["Electrical Installation","Plumbing & Pipe Fitting","Welding & Fabrication","Masonry & Bricklaying","Motor Vehicle Mechanics","Carpentry & Joinery","Painting & Decorating","Refrigeration & Air Conditioning","Metal Fabrication","Building & Construction"],
   unis:["Technical University of Kenya (TUK)","Technical University of Mombasa (TUM)","Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute – Eldoret","Sigalagala National Polytechnic – Kakamega","Kisumu Polytechnic","Meru National Polytechnic","Kabete National Polytechnic – Nairobi","Eldoret Technical Training Institute","Nakuru Technical Training Institute","Thika Technical Training Institute","Bumbe Technical Training Institute – Busia","Kitale Technical Training Institute","Kisii Technical Training Institute","Embu Technical Training Institute","Nyeri National Polytechnic","Kakamega Technical Training Institute","Mombasa Technical Training Institute","Coast Institute of Technology","Karen Technical Training Institute","Kamuthe Technical Training Institute – Embu","Machakos Technical Training Institute","Garissa Technical Training Institute","Lodwar Technical Training Institute – Turkana","Kapenguria Technical Training Institute – West Pokot","Maralal Technical Training Institute – Samburu"]},
  {id:"L5-BIZ",name:"Craft Cert — Business & Office",icon:"📋",color:"#455A64",note:"Min D mean.",fees:"Ksh 5,000–15,000/yr",duration:"2 years",
   progs:["Business Administration","Secretarial Studies","Office Management","Bookkeeping","Customer Service","Storekeeping & Stock Control"],
   unis:["Technical University of Kenya (TUK)","Kenya National Polytechnic – Nairobi","Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute","Sigalagala National Polytechnic","Kisumu Polytechnic","Meru National Polytechnic","Nakuru Technical Training Institute","Thika Technical Training Institute","Kenya Institute of Management (KIM) – branches nationwide","Bumbe Technical Training Institute","Kisii Technical Training Institute","Machakos Technical Training Institute","Embu Technical Training Institute","Eldoret Technical Training Institute","Garissa Technical Training Institute"]},
  {id:"L5-ICT",name:"Craft Cert — ICT",icon:"📱",color:"#006064",note:"Min D mean.",fees:"Ksh 5,000–15,000/yr",duration:"2 years",
   progs:["Computer Applications","Information Communication Technology","Computer Hardware & Networking","Data Entry & Office Automation","Mobile Phone Repair & Servicing"],
   unis:["Technical University of Kenya (TUK)","Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute","Sigalagala National Polytechnic","Kisumu Polytechnic","Meru National Polytechnic","Thika Technical Training Institute","Kabete National Polytechnic","Nakuru Technical Training Institute","Nyeri National Polytechnic","Eldoret Technical Training Institute","Kisii Technical Training Institute","Embu Technical Training Institute","Machakos Technical Training Institute","Garissa Technical Training Institute","All County TTIs nationwide"]},
  {id:"L5-HEALTH",name:"Craft Cert — Health & Community",icon:"💊",color:"#B71C1C",note:"Min D mean.",fees:"Ksh 5,000–15,000/yr",duration:"2 years",
   progs:["Community Health (Level 4)","Medical Engineering Technology (basic)","Environmental Health Assistant","Nutrition (basic)","First Aid & Rescue"],
   unis:["KMTC community affiliate campuses","Rift Valley Technical (Health section)","Nairobi Technical Training Institute (Health section)","County health training institutes – all 47 counties","Kenya Red Cross training centres","St. John Ambulance training centres"]},
];

const ARTISAN_CLUSTER = {
  id:"L4",name:"Artisan Certificate — All Trades",icon:"🛠️",color:"#546E7A",note:"Open to ALL KCSE candidates regardless of grades.",fees:"Ksh 3,000–10,000/yr",duration:"1 year",
  progs:["Carpentry & Joinery","Masonry & Bricklaying","Plumbing & Pipe Fitting","Electrical Wiring","Tailoring & Dressmaking","Hairdressing & Beauty Therapy","Motor Vehicle Mechanics","Welding & Fabrication","Agriculture (Crop Production)","Poultry & Small Animal Husbandry","Baking & Confectionery","Food Processing","Painting & Decorating","Tie & Dye / Batik"],
  unis:["Nairobi Technical Training Institute (NTTI)","Rift Valley Technical Training Institute – Eldoret","Sigalagala National Polytechnic – Kakamega","Kisumu Polytechnic","Meru National Polytechnic","Kabete National Polytechnic – Nairobi","Eldoret Technical Training Institute","Nakuru Technical Training Institute","Thika Technical Training Institute","Bumbe Technical Training Institute – Busia","Kitale Technical Training Institute","Kisii Technical Training Institute","Embu Technical Training Institute","Nyeri National Polytechnic","Kakamega Technical Training Institute","Mombasa Technical Training Institute","Coast Institute of Technology – Mombasa","Karen Technical Training Institute","Kamuthe Technical Training Institute – Embu","Machakos Technical Training Institute","Garissa Technical Training Institute","Lodwar Technical Training Institute – Turkana","Kapenguria TTI – West Pokot","Maralal TTI – Samburu","KATC – Naivasha (Agriculture trades)","KATC – Embu","KATC – Kitale","KATC – Meru","KATC – Nakuru (Njoro)","All 47 County Technical Training Institutes"],
};

function gp(g){return GRADE_POINTS[g]||0;}
function calcBest7(grades){return Object.values(grades).filter(Boolean).map(gp).sort((a,b)=>b-a).slice(0,7).reduce((s,p)=>s+p,0);}
function getMean(grades){
  const t=calcBest7(grades)/7;
  if(t>=11.5)return"A";if(t>=10.5)return"A-";if(t>=9.5)return"B+";if(t>=8.5)return"B";
  if(t>=7.5)return"B-";if(t>=6.5)return"C+";if(t>=5.5)return"C";if(t>=4.5)return"C-";
  if(t>=3.5)return"D+";if(t>=2.5)return"D";if(t>=1.5)return"D-";return"E";
}

function analyzeCluster(c,grades){
  const chosen=c.slots.map(opts=>{
    let best=null,bp=0;
    opts.forEach(s=>{if(grades[s]){const p=gp(grades[s]);if(p>bp){bp=p;best=s;}}});
    return{subject:best,points:bp};
  });
  const filled=chosen.filter(x=>x.subject).length;
  const slotTotal=chosen.reduce((s,x)=>s+x.points,0);
  const best7=calcBest7(grades);
  const score=(slotTotal>0&&best7>0)?Math.sqrt((slotTotal/48)*(best7/84))*48:0;
  const meanPts=best7/7;
  let qualifies=true,reasons=[];
  if(filled<4){qualifies=false;reasons.push(`Only ${filled}/4 cluster subjects available`);}
  if(meanPts<c.meanMin){qualifies=false;reasons.push("Mean grade too low");}
  Object.entries(c.mandatory||{}).forEach(([s,mg])=>{
    const altS=s.includes("Alt A")?"Mathematics (Alt B)":s.includes("Alt B")?"Mathematics (Alt A)":null;
    const g=grades[s]||(altS&&grades[altS]);
    if(!g||gp(g)<gp(mg)){qualifies=false;reasons.push(`Need ${mg} in ${s.replace(/ \(Alt [AB]\)/," Maths")}`);}
  });
  const tier=score>=c.cutoff?"Strong":score>=c.cutoff-5?"Competitive":score>=c.cutoff-10?"Borderline":"Below cutoff";
  if(tier==="Below cutoff"&&qualifies){qualifies=false;reasons.push("Score below typical cutoff");}
  return{...c,score:Math.round(score*100)/100,chosen,qualifies,reasons,tier};
}

const TIER_STYLES={"Strong":{bg:"#E8F5E9",color:"#1B5E20"},"Competitive":{bg:"#FFF8E1",color:"#E65100"},"Borderline":{bg:"#FFF3E0",color:"#BF360C"},"Below cutoff":{bg:"#FFEBEE",color:"#B71C1C"}};

// Encode grades to URL-safe string
function encodeGrades(grades){
  return btoa(JSON.stringify(grades));
}
function decodeGrades(str){
  try{ return JSON.parse(atob(str)); }catch(e){ return {}; }
}

export default function App(){
  const [screen,setScreen]=useState("splash");
  const [grades,setGrades]=useState({});
  const [selected,setSelected]=useState(null);
  const [tab,setTab]=useState("degree");
  const [showAll,setShowAll]=useState(false);
  const [darkMode,setDarkMode]=useState(false);
  const [saveMsg,setSaveMsg]=useState("");
  const [shareMsg,setShareMsg]=useState("");
  const [whatIfGrades,setWhatIfGrades]=useState<Record<string,string>>({});
  const [uniSearch,setUniSearch]=useState("");

  // Load from localStorage on mount
  useEffect(()=>{
    try{
      const saved=localStorage.getItem("unipathke_grades");
      if(saved) setGrades(JSON.parse(saved));
      const dm=localStorage.getItem("unipathke_dark");
      if(dm) setDarkMode(dm==="true");
    }catch(e){}
  },[]);

  // Save darkMode preference
  useEffect(()=>{
    try{ localStorage.setItem("unipathke_dark",String(darkMode)); }catch(e){}
  },[darkMode]);

  const filled=Object.values(grades).filter(Boolean).length;
  const meanGrade=filled>=4?getMean(grades):null;
  const best7=filled>=4?calcBest7(grades):0;
  const meanPts=best7/7;

  const degResults=useMemo(()=>{
    if(filled<4)return[];
    return DEG_CLUSTERS.map(c=>analyzeCluster(c,grades)).sort((a,b)=>b.qualifies-a.qualifies||b.score-a.score);
  },[grades,filled]);

  const qualDeg=degResults.filter(c=>c.qualifies);

  const wiEnteredSubjects=Object.keys(whatIfGrades).filter(s=>whatIfGrades[s]);
  const wiFilled=wiEnteredSubjects.length;
  const wiBest7=wiFilled>=4?calcBest7(whatIfGrades):0;
  const wiMeanGrade=wiFilled>=4?getMean(whatIfGrades):null;
  const wiMeanPts=wiBest7/7;
  const wiDegResults=useMemo(()=>{
    if(wiFilled<4)return[];
    return DEG_CLUSTERS.map(c=>analyzeCluster(c,whatIfGrades)).sort((a,b)=>b.qualifies-a.qualifies||b.score-a.score);
  },[whatIfGrades,wiFilled]);
  const wiQualDeg=wiDegResults.filter(c=>c.qualifies);
  const wiGained=wiQualDeg.filter(c=>!qualDeg.find(q=>q.id===c.id));
  const wiLost=qualDeg.filter(c=>!wiQualDeg.find(q=>q.id===c.id));

  const diplomas=DIPLOMA_CLUSTERS.filter(()=>meanPts>=5);
  const crafts=CRAFT_CLUSTERS.filter(()=>meanPts>=3);
  const showArtisan=meanPts>=1;

  const setGrade=(subj,val)=>setGrades(prev=>({...prev,[subj]:val||undefined}));

  const handleSave=()=>{
    try{
      localStorage.setItem("unipathke_grades",JSON.stringify(grades));
      setSaveMsg("✅ Saved!");
      setTimeout(()=>setSaveMsg(""),2500);
    }catch(e){ setSaveMsg("❌ Save failed"); setTimeout(()=>setSaveMsg(""),2500); }
  };

  const handleShare=()=>{
    try {
      const code = encodeGrades(grades);
      const base = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
      const url = base ? `${base}?grades=${code}` : `https://unipathke.app?grades=${code}`;
      const text = `My KCSE Mean Grade: ${meanGrade}\nI qualify for ${qualDeg.length} degree cluster(s)!\nCheck your own pathways 👇\n${url}`;
      if(typeof navigator !== "undefined" && navigator.share){
        navigator.share({title:"My UniPathKE Results", text, url}).catch(()=>{});
      } else if(typeof navigator !== "undefined" && navigator.clipboard){
        navigator.clipboard.writeText(text).then(()=>{
          setShareMsg("✅ Copied!");
          setTimeout(()=>setShareMsg(""),3000);
        }).catch(()=>{
          setShareMsg("📋 Copy from address bar");
          setTimeout(()=>setShareMsg(""),3000);
        });
      } else {
        setShareMsg("📋 Copy from address bar");
        setTimeout(()=>setShareMsg(""),3000);
      }
    } catch(e) {
      setShareMsg("📋 Share unavailable here");
      setTimeout(()=>setShareMsg(""),3000);
    }
  };

  const handleWhatsAppShare=()=>{
    try {
      const base = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://unipathke.replit.app";
      const top = qualDeg.length>0 ? `🏆 Top cluster: ${qualDeg[0].name} (${qualDeg[0].score.toFixed(1)} pts)\n` : "";
      const text =
        `🎓 *My UniPathKE Results*\n` +
        `📊 KCSE Mean Grade: *${meanGrade}* (${best7} pts)\n` +
        `✅ Qualifying degree clusters: *${qualDeg.length}*\n` +
        `${top}` +
        `\n🔗 Check your own pathways free 👇\n${base}`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch(e) {
      setShareMsg("❌ Could not open WhatsApp");
      setTimeout(()=>setShareMsg(""),3000);
    }
  };

  const bg=darkMode?"#121212":"#F5F7F8";
  const card=darkMode?"#1E1E1E":"#fff";
  const txt=darkMode?"#E0E0E0":"#212121";
  const sub=darkMode?"#90A4AE":"#607D8B";
  const bdr=darkMode?"#333":"#ECEFF1";

  // ── SPLASH ──
  if(screen==="splash") return(
    <div style={{minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url('/splash-bg.jpg')",backgroundSize:"cover",backgroundPosition:"center top",zIndex:0}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(0,77,64,0.82) 0%,rgba(0,96,100,0.78) 60%,rgba(0,0,0,0.70) 100%)",zIndex:1}}/>
      <div style={{position:"relative",zIndex:2,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:60}}>🎓</div>
        <div style={{fontSize:32,fontWeight:900,color:"#fff",marginTop:8,textShadow:"0 2px 12px rgba(0,0,0,0.5)"}}>UniPathKE</div>
        <div style={{fontSize:13,color:"#B2EBF2",marginTop:4,marginBottom:6,fontWeight:700}}>2026 Edition</div>
        <div style={{fontSize:14,color:"#E0F7FA",marginBottom:24,lineHeight:1.7,textShadow:"0 1px 6px rgba(0,0,0,0.4)"}}>Kenya's complete KUCCPS pathway guide<br/>for every KCSE grade level</div>
        <div style={{background:"rgba(0,0,0,0.38)",backdropFilter:"blur(8px)",borderRadius:16,padding:16,marginBottom:20,textAlign:"left",border:"1px solid rgba(255,255,255,0.15)"}}>
          {[["🎓","15 Degree clusters with cutoff points"],["📘","8 Diploma L6 clusters (TVET)"],["📋","4 Craft Certificate L5 clusters"],["🛠️","Artisan L4 — open to everyone"],["💰","Fee estimates per programme"],["📅","2026 KUCCPS dates tab"],["💾","Save grades to your device"],["🔗","Share results via WhatsApp"]].map(([i,t])=>(
            <div key={t} style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
              <span style={{fontSize:17}}>{i}</span><span style={{fontSize:13,color:"#E0F7FA"}}>{t}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>setScreen("grades")} style={{width:"100%",padding:16,borderRadius:12,border:"none",cursor:"pointer",background:"#FFB300",color:"#212121",fontSize:17,fontWeight:800,boxShadow:"0 4px 20px rgba(255,179,0,0.4)"}}>GET STARTED →</button>
        <div style={{fontSize:11,color:"#80DEEA",marginTop:12}}>Free · No sign-up · 2026 Updated</div>
      </div>
    </div>
  );

  // ── DETAIL ──
  if(screen==="detail"&&selected){
    const isDeg=selected.level==="degree";
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:selected.color,padding:"14px 16px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setScreen("results")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontSize:15}}>←</button>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",flex:1}}>{selected.icon} {selected.name}</div>
          </div>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px 60px"}}>
          <div style={{background:selected.color,borderRadius:14,padding:18,marginBottom:14,color:"#fff"}}>
            <div style={{fontSize:13,opacity:.85,marginBottom:10}}>{selected.desc||selected.note}</div>
            {isDeg&&(
              <div style={{display:"flex",gap:16,background:"#fff2",borderRadius:10,padding:"10px 14px",flexWrap:"wrap"}}>
                <div><div style={{fontSize:11,opacity:.8}}>Your Score</div><div style={{fontSize:26,fontWeight:900}}>{selected.score.toFixed(1)}</div></div>
                <div><div style={{fontSize:11,opacity:.8}}>Cutoff (~)</div><div style={{fontSize:26,fontWeight:900}}>{selected.cutoff}</div></div>
                <div><div style={{fontSize:11,opacity:.8}}>Tier</div><div style={{fontSize:20,fontWeight:900}}>{selected.tier}</div></div>
              </div>
            )}
          </div>

          {/* Fees */}
          <div style={{background:card,borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
            <div style={{fontSize:11,fontWeight:800,color:"#90A4AE",marginBottom:8}}>💰 FEE INFORMATION (Annual)</div>
            {isDeg&&selected.fees?(
              <>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:sub}}>Govt Sponsored</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#2E7D32"}}>{selected.fees.gov}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:sub}}>Self Sponsored</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#B71C1C"}}>{selected.fees.self}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:sub}}>Duration</span>
                  <span style={{fontSize:13,fontWeight:700,color:txt}}>{selected.fees.duration}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                  <span style={{fontSize:13,color:sub}}>HELB Loan</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#1565C0"}}>✅ helb.co.ke</span>
                </div>
                <div style={{marginTop:8,fontSize:11,color:sub,background:darkMode?"#2a2a2a":"#F5F5F5",padding:"6px 10px",borderRadius:8}}>
                  💡 Paid per semester (2 per year). HELB: Ksh 35,000–60,000/yr available.
                </div>
              </>
            ):(
              <>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bdr}`}}>
                  <span style={{fontSize:13,color:sub}}>Annual Fees</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#2E7D32"}}>{selected.fees}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                  <span style={{fontSize:13,color:sub}}>Duration</span>
                  <span style={{fontSize:13,fontWeight:700,color:txt}}>{selected.duration}</span>
                </div>
                <div style={{marginTop:8,fontSize:11,color:sub,background:darkMode?"#2a2a2a":"#F5F5F5",padding:"6px 10px",borderRadius:8}}>
                  💡 TVET govt-placed students pay minimal levies only — no tuition fees.
                </div>
              </>
            )}
          </div>

          {isDeg&&selected.chosen&&(
            <div style={{background:card,borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
              <div style={{fontSize:11,fontWeight:800,color:"#90A4AE",marginBottom:8}}>CLUSTER SUBJECTS USED</div>
              {selected.chosen.map((c,i)=>c.subject&&(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<3?`1px solid ${bdr}`:"none"}}>
                  <span style={{fontSize:13,color:sub}}>• {c.subject}</span>
                  <span style={{fontSize:13,fontWeight:700,color:selected.color}}>{c.points} pts</span>
                </div>
              ))}
            </div>
          )}

          <div style={{background:card,borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
            <div style={{fontSize:11,fontWeight:800,color:"#90A4AE",marginBottom:8}}>PROGRAMMES</div>
            {(selected.progs||[]).map((p,i)=>(
              <div key={i} style={{padding:"8px 0",borderBottom:i<selected.progs.length-1?`1px solid ${bdr}`:"none",fontSize:13,color:txt}}>
                📌 {typeof p==="string"?p:p.name}
                {p.unis&&<div style={{marginTop:4,paddingLeft:14}}>{p.unis.map((u,j)=><div key={j} style={{fontSize:12,color:sub,marginTop:2}}>🏫 {u}</div>)}</div>}
              </div>
            ))}
          </div>

          {selected.unis&&(
            <div style={{background:card,borderRadius:14,padding:14,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
              <div style={{fontSize:11,fontWeight:800,color:"#90A4AE",marginBottom:8}}>INSTITUTIONS</div>
              {selected.unis.map((u,i)=>(
                <div key={i} style={{padding:"6px 0",borderBottom:i<selected.unis.length-1?`1px solid ${bdr}`:"none",fontSize:13,color:sub}}>🏫 {u}</div>
              ))}
            </div>
          )}

          <div style={{background:"#FFF8E1",borderRadius:14,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:"#E65100",marginBottom:8}}>💡 APPLICATION TIPS</div>
            {[
              isDeg?`Score ${selected.score.toFixed(1)} vs cutoff ~${selected.cutoff}: ${selected.score>=selected.cutoff?"✅ Good position!":"Target universities with lower cutoffs."}`:selected.note,
              "Apply in order of preference on students.kuccps.net",
              "Apply to 3–6 programmes for best chances",
              "Placement results expected July 2026",
              "University admissions begin late August 2026",
              isDeg?"Apply for HELB loan at helb.co.ke after placement":"TVET placed students pay minimal fees only",
            ].filter(Boolean).map((t,i)=><div key={i} style={{fontSize:13,color:"#37474F",marginBottom:5}}>• {t}</div>)}
          </div>

          <div style={{background:"#E3F2FD",borderRadius:14,padding:14,textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#0D47A1",marginBottom:4}}>🌐 Apply at KUCCPS Portal</div>
            <div style={{fontSize:15,color:"#1565C0",fontWeight:800}}>students.kuccps.net</div>
            <div style={{fontSize:12,color:"#5C6BC0",marginTop:4}}>Login with KCSE Index Number & Year</div>
          </div>
        </div>
      </div>
    );
  }

  // ── DATES ──
  if(screen==="dates"){
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#E65100",padding:"14px 16px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setScreen("results")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>←</button>
          <div style={{fontSize:15,fontWeight:800,color:"#fff",flex:1,textAlign:"center"}}>📅 KUCCPS 2026 Dates</div>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px 40px"}}>
          <div style={{background:card,borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #0001",border:"2px solid #E6510033"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#E65100",marginBottom:12}}>📅 KUCCPS 2026 APPLICATION TIMELINE</div>
            {KUCCPS_DATES.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<KUCCPS_DATES.length-1?`1px solid ${bdr}`:"none"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:d.done?"#ECEFF1":"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                  {d.done?"✅":"⏳"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:d.done?"#90A4AE":txt,fontWeight:d.done?400:600,textDecoration:d.done?"line-through":"none"}}>{d.label}</div>
                  <div style={{fontSize:12,fontWeight:700,color:d.done?"#B0BEC5":"#2E7D32",marginTop:2}}>{d.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:card,borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
            <div style={{fontSize:13,fontWeight:800,color:"#1565C0",marginBottom:10}}>ℹ️ WHAT THIS MEANS FOR YOU</div>
            {[
              {icon:"✅",text:"Application windows are now closed. If you applied, await placement results in July 2026."},
              {icon:"⏳",text:"Placement results expected July 2026. Check students.kuccps.net regularly."},
              {icon:"🏫",text:"University admissions and reporting begins late August 2026."},
              {icon:"💰",text:"Apply for HELB loan at helb.co.ke as soon as you receive your placement letter."},
              {icon:"📞",text:"KUCCPS Helpline: 0800 724 800 (toll-free)"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:13,color:txt,lineHeight:1.5}}>{item.text}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#E3F2FD",borderRadius:14,padding:14,textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:800,color:"#0D47A1",marginBottom:4}}>🌐 KUCCPS Student Portal</div>
            <div style={{fontSize:16,color:"#1565C0",fontWeight:900}}>students.kuccps.net</div>
            <div style={{fontSize:12,color:"#5C6BC0",marginTop:4}}>Check placement status · Late opportunities</div>
          </div>
        </div>
      </div>
    );
  }

  // ── WHAT-IF ──
  if(screen==="whatif"){
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#6A1B9A",padding:"14px 16px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setScreen("results")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>←</button>
          <div style={{fontSize:15,fontWeight:800,color:"#fff",flex:1,textAlign:"center"}}>🔮 What-If Simulator</div>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px 40px"}}>
          <div style={{background:"linear-gradient(135deg,#4A148C,#6A1B9A)",borderRadius:14,padding:16,marginBottom:12,color:"#fff"}}>
            <div style={{fontSize:11,color:"#CE93D8",fontWeight:700,marginBottom:10}}>SIMULATION VS YOUR ACTUAL GRADES</div>
            <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",marginBottom:10}}>
              <div style={{flex:1,background:"#fff2",padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#CE93D8"}}>ACTUAL</div>
                <div style={{fontSize:26,fontWeight:900,color:"#FFB300"}}>{meanGrade}</div>
                <div style={{fontSize:11,color:"#E1BEE7"}}>{best7} pts · {qualDeg.length} clusters</div>
              </div>
              <div style={{width:2,background:"#fff3"}}/>
              <div style={{flex:1,background:"#fff2",padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#CE93D8"}}>SIMULATED</div>
                <div style={{fontSize:26,fontWeight:900,color:wiBest7>best7?"#69F0AE":wiBest7<best7?"#FF5252":"#FFB300"}}>{wiMeanGrade||"—"}</div>
                <div style={{fontSize:11,color:"#E1BEE7"}}>{wiBest7} pts · {wiQualDeg.length} clusters</div>
              </div>
            </div>
            {wiGained.length>0&&<div style={{background:"#1B5E2088",borderRadius:8,padding:"6px 10px",marginBottom:6,fontSize:12}}>✅ <strong>Gained:</strong> {wiGained.map(c=>c.name).join(", ")}</div>}
            {wiLost.length>0&&<div style={{background:"#B71C1C88",borderRadius:8,padding:"6px 10px",marginBottom:6,fontSize:12}}>❌ <strong>Lost:</strong> {wiLost.map(c=>c.name).join(", ")}</div>}
            {wiGained.length===0&&wiLost.length===0&&wiFilled>=4&&<div style={{background:"#fff2",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#CE93D8"}}>No change in qualifying clusters yet</div>}
            <button onClick={()=>setWhatIfGrades(Object.fromEntries(Object.entries(grades).filter(([,v])=>v)) as Record<string,string>)}
              style={{marginTop:8,width:"100%",padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",background:"#ffffff22",color:"#fff",fontWeight:700,fontSize:12}}>
              ↺ Reset to My Actual Grades
            </button>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:"#6A1B9A",marginBottom:8,letterSpacing:.5}}>TWEAK YOUR GRADES BELOW</div>
          {Object.entries(SUBJECTS).map(([group,subjects])=>{
            const groupSubjects=subjects.filter(s=>grades[s]);
            if(groupSubjects.length===0)return null;
            return(
              <div key={group} style={{background:card,borderRadius:14,marginBottom:10,overflow:"hidden",border:`1px solid ${bdr}`}}>
                <div style={{background:"#4A148C",padding:"7px 14px",fontSize:11,fontWeight:700,color:"#CE93D8",letterSpacing:.8}}>{group.toUpperCase()}</div>
                {groupSubjects.map(subj=>{
                  const orig=grades[subj]||"";
                  const sim=whatIfGrades[subj]||orig;
                  const changed=sim!==orig;
                  return(
                    <div key={subj} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${bdr}`}}>
                      <div style={{flex:1,paddingRight:8}}>
                        <div style={{fontSize:13,color:txt}}>{subj}</div>
                        {changed&&<div style={{fontSize:11,color:"#6A1B9A",marginTop:2}}>{orig} → <strong>{sim}</strong></div>}
                      </div>
                      <select value={sim} onChange={e=>setWhatIfGrades(prev=>({...prev,[subj]:e.target.value}))}
                        style={{padding:"7px 6px",borderRadius:8,border:`1.5px solid ${changed?"#6A1B9A":"#CFD8DC"}`,fontSize:14,background:changed?"#F3E5F5":darkMode?"#2a2a2a":"#fff",color:changed?"#4A148C":txt,fontWeight:changed?800:400,cursor:"pointer",minWidth:70,outline:"none"}}>
                        {ALL_GRADES.map(g=><option key={g}>{g}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{background:darkMode?"#2a2a2a":"#F3E5F5",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#4A148C",marginBottom:12}}>
            💡 Changes here are simulation-only and won't affect your saved grades.
          </div>
        </div>
      </div>
    );
  }

  // ── UNI FINDER ──
  if(screen==="unifinder"){
    const q=uniSearch.trim().toLowerCase();
    const uniMap:Record<string,{deg:{cluster:string,prog:string,cutoff:string}[],dip:string[],craft:string[]}>={}; 
    const touch=(u:string)=>{if(!uniMap[u])uniMap[u]={deg:[],dip:[],craft:[]};};
    DEG_CLUSTERS.forEach(c=>{
      (c.progs||[]).forEach((p:{name:string,unis:string[]})=>{
        (p.unis||[]).forEach(raw=>{
          const name=raw.split("~")[0].trim();
          const cutoff=raw.includes("~")?"~"+raw.split("~")[1].trim():"";
          touch(name);
          uniMap[name].deg.push({cluster:c.name,prog:p.name,cutoff});
        });
      });
    });
    [...DIPLOMA_CLUSTERS,...CRAFT_CLUSTERS].forEach((c:any)=>{
      const lvl=c.id.startsWith("L5")?"craft":"dip";
      (c.unis||[]).forEach((u:string)=>{touch(u);uniMap[u][lvl].push(c.name);});
    });
    const allUnis=Object.keys(uniMap).sort();
    const filtered=q?allUnis.filter(u=>u.toLowerCase().includes(q)):allUnis;
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#00695C",padding:"14px 16px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setScreen("results")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>←</button>
          <div style={{fontSize:15,fontWeight:800,color:"#fff",flex:1,textAlign:"center"}}>🏫 University Finder</div>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px 40px"}}>
          <div style={{background:card,borderRadius:14,padding:12,marginBottom:12,border:`1px solid ${bdr}`}}>
            <input autoFocus value={uniSearch} onChange={e=>setUniSearch(e.target.value)}
              placeholder="🔍  Search university name…"
              style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${uniSearch?"#006064":bdr}`,fontSize:14,background:darkMode?"#1a1a1a":"#F8FAFB",color:txt,outline:"none"}}/>
            {uniSearch&&<button onClick={()=>setUniSearch("")} style={{marginTop:8,fontSize:12,color:sub,background:"none",border:"none",cursor:"pointer"}}>✕ Clear</button>}
            <div style={{fontSize:11,color:sub,marginTop:6}}>{filtered.length} of {allUnis.length} universities shown</div>
          </div>
          {filtered.length===0&&(
            <div style={{background:card,borderRadius:14,padding:24,textAlign:"center",border:`1px solid ${bdr}`}}>
              <div style={{fontSize:28,marginBottom:8}}>🏫</div>
              <div style={{fontWeight:700,color:txt}}>No universities found</div>
              <div style={{fontSize:13,color:sub,marginTop:4}}>Try "Nairobi", "JKUAT", "Moi" or "KMTC"</div>
            </div>
          )}
          {filtered.map(uname=>{
            const data=uniMap[uname];
            const hasDeg=data.deg.length>0;
            const hasDip=data.dip.length>0;
            const hasCraft=data.craft.length>0;
            return(
              <div key={uname} style={{background:card,borderRadius:14,marginBottom:10,overflow:"hidden",border:`1px solid ${bdr}`,boxShadow:"0 2px 8px #0001"}}>
                <div style={{background:"#006064",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>🏫</span>
                  <div style={{fontSize:13,fontWeight:800,color:"#fff",flex:1}}>{uname}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {hasDeg&&<span style={{fontSize:10,fontWeight:700,background:"#FFB300",color:"#212121",borderRadius:10,padding:"2px 7px"}}>🎓 Degree</span>}
                    {hasDip&&<span style={{fontSize:10,fontWeight:700,background:"#1565C0",color:"#fff",borderRadius:10,padding:"2px 7px"}}>📘 Diploma</span>}
                    {hasCraft&&<span style={{fontSize:10,fontWeight:700,background:"#4A148C",color:"#fff",borderRadius:10,padding:"2px 7px"}}>📋 Craft</span>}
                  </div>
                </div>
                <div style={{padding:"10px 14px"}}>
                  {hasDeg&&(<><div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:2}}>DEGREE PROGRAMMES</div>
                    {data.deg.map((d,i)=>(<div key={i} style={{padding:"5px 0",borderBottom:i<data.deg.length-1?`1px solid ${bdr}`:"none"}}>
                      <div style={{fontSize:12,color:txt,fontWeight:600}}>{d.prog}</div>
                      <div style={{fontSize:11,color:sub,marginTop:2}}>{d.cluster} · cutoff {d.cutoff}</div>
                    </div>))}</>)}
                  {hasDip&&(<><div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:hasDeg?10:2}}>DIPLOMA PROGRAMMES</div>
                    {data.dip.map((d,i)=>(<div key={i} style={{padding:"4px 0",borderBottom:i<data.dip.length-1?`1px solid ${bdr}`:"none",fontSize:12,color:sub}}>📘 {d}</div>))}</>)}
                  {hasCraft&&(<><div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:(hasDeg||hasDip)?10:2}}>CRAFT PROGRAMMES</div>
                    {data.craft.map((d,i)=>(<div key={i} style={{padding:"4px 0",borderBottom:i<data.craft.length-1?`1px solid ${bdr}`:"none",fontSize:12,color:sub}}>📋 {d}</div>))}</>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if(screen==="results"){
    const tabs=[
      {key:"degree",label:`🎓 Degree`,count:qualDeg.length,show:meanPts>=7},
      {key:"diploma",label:`📘 Diploma`,count:diplomas.length,show:meanPts>=5},
      {key:"craft",label:`📋 Craft`,count:crafts.length,show:meanPts>=3},
      {key:"artisan",label:`🛠️ Artisan`,count:showArtisan?1:0,show:showArtisan},
    ].filter(t=>t.show);

    const listToShow=tab==="degree"?(showAll?degResults:qualDeg):tab==="diploma"?diplomas:tab==="craft"?crafts:[ARTISAN_CLUSTER];

    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#006064",padding:"14px 16px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:8}} className="no-print">
          <button onClick={()=>setScreen("grades")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>←</button>
          <div style={{fontSize:15,fontWeight:800,color:"#fff",flex:1,textAlign:"center"}}>Your Pathways</div>
          <button onClick={()=>window.print()} title="Save as PDF" style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:15}}>🖨️</button>
          <button onClick={()=>setDarkMode(!darkMode)} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:15}}>{darkMode?"☀️":"🌙"}</button>
        </div>

        <div style={{maxWidth:480,margin:"0 auto",padding:"14px 14px 40px"}}>

          {/* Summary card */}
          <div style={{background:"linear-gradient(135deg,#004D40,#006064)",borderRadius:16,padding:18,marginBottom:14,color:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:"#B2EBF2"}}>KCSE Mean Grade</div>
                <div style={{fontSize:36,fontWeight:900,color:"#FFB300"}}>{meanGrade}</div>
                <div style={{fontSize:13,color:"#E0F7FA"}}>{best7} pts · best {Math.min(filled,7)} subjects</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#B2EBF2"}}>Degree Clusters</div>
                <div style={{fontSize:36,fontWeight:900}}>{qualDeg.length}</div>
                <div style={{fontSize:11,color:"#80DEEA"}}>qualifying</div>
              </div>
            </div>
            {qualDeg.length>0&&<div style={{background:"#fff2",borderRadius:10,padding:"8px 12px",fontSize:13,marginBottom:10}}>
              🏆 Best: <strong>{qualDeg[0].name}</strong> ({qualDeg[0].score.toFixed(1)} pts)
            </div>}
            {/* Save & Share buttons */}
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleSave} style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",background:"#FFB300",color:"#212121",fontWeight:800,fontSize:13}}>
                {saveMsg||"💾 Save Grades"}
              </button>
              <button
                onClick={handleWhatsAppShare}
                style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",background:"#25D366",color:"#fff",fontWeight:800,fontSize:13,WebkitTapHighlightColor:"transparent",touchAction:"manipulation",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.848L.057 23.535a.5.5 0 0 0 .612.612l5.688-1.474A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.204-1.431l-.372-.22-3.853.998 1.02-3.741-.242-.386A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Share on WhatsApp
              </button>
            </div>
            {shareMsg&&<div style={{marginTop:8,fontSize:12,color:"#B2EBF2",textAlign:"center"}}>{shareMsg}</div>}
          </div>

          {/* ── TOOLS ROW ── */}
          <div style={{marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                {icon:"📅",label:"KUCCPS\nDates",color:"#E65100",sc:"dates"},
                {icon:"🔮",label:"What-If\nSimulator",color:"#6A1B9A",sc:"whatif"},
                {icon:"🏫",label:"Uni\nFinder",color:"#00695C",sc:"unifinder"},
              ].map(t=>(
                <button key={t.sc} onClick={()=>{
                  if(t.sc==="whatif"&&Object.keys(whatIfGrades).length===0){
                    setWhatIfGrades(Object.fromEntries(Object.entries(grades).filter(([,v])=>v)) as Record<string,string>);
                  }
                  setScreen(t.sc);
                }} style={{background:t.color,borderRadius:12,padding:"14px 6px",border:"none",cursor:"pointer",color:"#fff",textAlign:"center"}}>
                  <div style={{fontSize:24}}>{t.icon}</div>
                  <div style={{fontSize:11,fontWeight:700,marginTop:5,lineHeight:1.4,whiteSpace:"pre-line"}}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Course Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>{
                setTab(t.key);setShowAll(false);
                if(t.key==="whatif"&&Object.keys(whatIfGrades).length===0){
                  setWhatIfGrades(Object.fromEntries(Object.entries(grades).filter(([,v])=>v)) as Record<string,string>);
                }
              }}
                style={{padding:"8px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",gap:5,
                  background:tab===t.key?(t.key==="dates"?"#E65100":t.key==="whatif"?"#6A1B9A":"#006064"):"#ECEFF1",
                  color:tab===t.key?"#fff":"#607D8B"}}>
                {t.label}
                {t.count!==null&&<span style={{fontSize:11,fontWeight:800,padding:"1px 6px",borderRadius:10,background:tab===t.key?"#ffffff33":"#006064",color:tab===t.key?"#fff":"#fff",minWidth:18,textAlign:"center"}}>{t.count}</span>}
              </button>
            ))}
          </div>

          {/* ── DATES TAB ── */}
          {tab==="dates"&&(
            <div>
              <div style={{background:card,borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #0001",border:"2px solid #E6510033"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#E65100",marginBottom:12}}>📅 KUCCPS 2026 APPLICATION TIMELINE</div>
                {KUCCPS_DATES.map((d,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<KUCCPS_DATES.length-1?`1px solid ${bdr}`:"none"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:d.done?"#ECEFF1":"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                      {d.done?"✅":"⏳"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:d.done?"#90A4AE":txt,fontWeight:d.done?400:600,textDecoration:d.done?"line-through":"none"}}>{d.label}</div>
                      <div style={{fontSize:12,fontWeight:700,color:d.done?"#B0BEC5":"#2E7D32",marginTop:2}}>{d.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:card,borderRadius:14,padding:16,marginBottom:14,boxShadow:"0 2px 8px #0001",border:`1px solid ${bdr}`}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1565C0",marginBottom:10}}>ℹ️ WHAT THIS MEANS FOR YOU</div>
                {[
                  {icon:"✅",text:"Application windows are now closed. If you applied, await placement results in July 2026."},
                  {icon:"⏳",text:"Placement results expected July 2026. Check students.kuccps.net regularly."},
                  {icon:"🏫",text:"University admissions and reporting begins late August 2026."},
                  {icon:"💰",text:"Apply for HELB loan at helb.co.ke as soon as you receive your placement letter."},
                  {icon:"📞",text:"KUCCPS Helpline: 0800 724 800 (toll-free)"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                    <span style={{fontSize:13,color:txt,lineHeight:1.5}}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{background:"#E3F2FD",borderRadius:14,padding:14,textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:800,color:"#0D47A1",marginBottom:4}}>🌐 KUCCPS Student Portal</div>
                <div style={{fontSize:16,color:"#1565C0",fontWeight:900}}>students.kuccps.net</div>
                <div style={{fontSize:12,color:"#5C6BC0",marginTop:4}}>Check placement status · Late opportunities</div>
              </div>
            </div>
          )}

          {/* ── WHAT-IF TAB ── */}
          {tab==="whatif"&&(
            <div>
              {/* Score comparison bar */}
              <div style={{background:"linear-gradient(135deg,#4A148C,#6A1B9A)",borderRadius:14,padding:16,marginBottom:12,color:"#fff"}}>
                <div style={{fontSize:11,color:"#CE93D8",fontWeight:700,marginBottom:10}}>SIMULATION VS YOUR ACTUAL GRADES</div>
                <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                  <div style={{flex:1,background:"#fff2",padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#CE93D8"}}>ACTUAL</div>
                    <div style={{fontSize:26,fontWeight:900,color:"#FFB300"}}>{meanGrade}</div>
                    <div style={{fontSize:11,color:"#E1BEE7"}}>{best7} pts · {qualDeg.length} clusters</div>
                  </div>
                  <div style={{width:2,background:"#fff3"}}/>
                  <div style={{flex:1,background:"#fff2",padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#CE93D8"}}>SIMULATED</div>
                    <div style={{fontSize:26,fontWeight:900,color:wiBest7>best7?"#69F0AE":wiBest7<best7?"#FF5252":"#FFB300"}}>{wiMeanGrade||"—"}</div>
                    <div style={{fontSize:11,color:"#E1BEE7"}}>{wiBest7} pts · {wiQualDeg.length} clusters</div>
                  </div>
                </div>
                {/* Diff badges */}
                {wiGained.length>0&&<div style={{background:"#1B5E2088",borderRadius:8,padding:"6px 10px",marginBottom:6,fontSize:12}}>
                  ✅ <strong>Gained:</strong> {wiGained.map(c=>c.name).join(", ")}
                </div>}
                {wiLost.length>0&&<div style={{background:"#B71C1C88",borderRadius:8,padding:"6px 10px",marginBottom:6,fontSize:12}}>
                  ❌ <strong>Lost:</strong> {wiLost.map(c=>c.name).join(", ")}
                </div>}
                {wiGained.length===0&&wiLost.length===0&&wiFilled>=4&&<div style={{background:"#fff2",borderRadius:8,padding:"6px 10px",fontSize:12,color:"#CE93D8"}}>
                  No change in qualifying clusters yet
                </div>}
                <button onClick={()=>setWhatIfGrades(Object.fromEntries(Object.entries(grades).filter(([,v])=>v)) as Record<string,string>)}
                  style={{marginTop:8,width:"100%",padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",background:"#ffffff22",color:"#fff",fontWeight:700,fontSize:12}}>
                  ↺ Reset to My Actual Grades
                </button>
              </div>

              {/* Subject dropdowns */}
              <div style={{fontSize:11,fontWeight:800,color:"#6A1B9A",marginBottom:8,letterSpacing:.5}}>TWEAK YOUR GRADES BELOW</div>
              {Object.entries(SUBJECTS).map(([group,subjects])=>{
                const groupSubjects=subjects.filter(s=>grades[s]);
                if(groupSubjects.length===0)return null;
                return(
                  <div key={group} style={{background:card,borderRadius:14,marginBottom:10,overflow:"hidden",border:`1px solid ${bdr}`}}>
                    <div style={{background:"#4A148C",padding:"7px 14px",fontSize:11,fontWeight:700,color:"#CE93D8",letterSpacing:.8}}>{group.toUpperCase()}</div>
                    {groupSubjects.map(subj=>{
                      const orig=grades[subj]||"";
                      const sim=whatIfGrades[subj]||orig;
                      const changed=sim!==orig;
                      return(
                        <div key={subj} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${bdr}`}}>
                          <div style={{flex:1,paddingRight:8}}>
                            <div style={{fontSize:13,color:txt}}>{subj}</div>
                            {changed&&<div style={{fontSize:11,color:"#6A1B9A",marginTop:2}}>{orig} → <strong>{sim}</strong></div>}
                          </div>
                          <select
                            value={sim}
                            onChange={e=>setWhatIfGrades(prev=>({...prev,[subj]:e.target.value}))}
                            style={{padding:"7px 6px",borderRadius:8,border:`1.5px solid ${changed?"#6A1B9A":"#CFD8DC"}`,fontSize:14,background:changed?"#F3E5F5":darkMode?"#2a2a2a":"#fff",color:changed?"#4A148C":txt,fontWeight:changed?800:400,cursor:"pointer",minWidth:70,outline:"none"}}>
                            {ALL_GRADES.map(g=><option key={g}>{g}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{background:darkMode?"#2a2a2a":"#F3E5F5",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#4A148C",marginBottom:12}}>
                💡 Changes here are simulation-only and won't affect your saved grades.
              </div>
            </div>
          )}

          {/* ── UNI FINDER TAB ── */}
          {tab==="unifinder"&&(()=>{
            const q=uniSearch.trim().toLowerCase();
            // Build per-university results across all levels
            const uniMap:Record<string,{deg:{cluster:string,prog:string,cutoff:string}[],dip:string[],craft:string[]}>={}; 
            const touch=(u:string)=>{if(!uniMap[u])uniMap[u]={deg:[],dip:[],craft:[]};};
            DEG_CLUSTERS.forEach(c=>{
              (c.progs||[]).forEach((p:{name:string,unis:string[]})=>{
                (p.unis||[]).forEach(raw=>{
                  const name=raw.split("~")[0].trim();
                  const cutoff=raw.includes("~")?"~"+raw.split("~")[1].trim():"";
                  touch(name);
                  uniMap[name].deg.push({cluster:c.name,prog:p.name,cutoff});
                });
              });
            });
            [...DIPLOMA_CLUSTERS,...CRAFT_CLUSTERS].forEach((c:any)=>{
              const lvl=c.id.startsWith("L5")?"craft":"dip";
              (c.unis||[]).forEach((u:string)=>{
                touch(u);
                uniMap[u][lvl].push(c.name);
              });
            });
            const allUnis=Object.keys(uniMap).sort();
            const filtered=q?allUnis.filter(u=>u.toLowerCase().includes(q)):allUnis;
            return(
              <div>
                <div style={{background:card,borderRadius:14,padding:12,marginBottom:12,border:`1px solid ${bdr}`}}>
                  <input
                    autoFocus
                    value={uniSearch}
                    onChange={e=>setUniSearch(e.target.value)}
                    placeholder="🔍  Search university name…"
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${uniSearch?"#006064":bdr}`,fontSize:14,background:darkMode?"#1a1a1a":"#F8FAFB",color:txt,outline:"none"}}
                  />
                  {uniSearch&&<button onClick={()=>setUniSearch("")} style={{marginTop:8,fontSize:12,color:sub,background:"none",border:"none",cursor:"pointer"}}>✕ Clear</button>}
                  <div style={{fontSize:11,color:sub,marginTop:6}}>{filtered.length} of {allUnis.length} universities shown</div>
                </div>

                {filtered.length===0&&(
                  <div style={{background:card,borderRadius:14,padding:24,textAlign:"center",border:`1px solid ${bdr}`}}>
                    <div style={{fontSize:28,marginBottom:8}}>🏫</div>
                    <div style={{fontWeight:700,color:txt}}>No universities found</div>
                    <div style={{fontSize:13,color:sub,marginTop:4}}>Try a shorter search, e.g. "Nairobi" or "JKUAT"</div>
                  </div>
                )}

                {filtered.map(uname=>{
                  const data=uniMap[uname];
                  const hasDeg=data.deg.length>0;
                  const hasDip=data.dip.length>0;
                  const hasCraft=data.craft.length>0;
                  return(
                    <div key={uname} style={{background:card,borderRadius:14,marginBottom:10,overflow:"hidden",border:`1px solid ${bdr}`,boxShadow:"0 2px 8px #0001"}}>
                      <div style={{background:"#006064",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:18}}>🏫</span>
                        <div style={{fontSize:13,fontWeight:800,color:"#fff",flex:1}}>{uname}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>
                          {hasDeg&&<span style={{fontSize:10,fontWeight:700,background:"#FFB300",color:"#212121",borderRadius:10,padding:"2px 7px"}}>🎓 Degree</span>}
                          {hasDip&&<span style={{fontSize:10,fontWeight:700,background:"#1565C0",color:"#fff",borderRadius:10,padding:"2px 7px"}}>📘 Diploma</span>}
                          {hasCraft&&<span style={{fontSize:10,fontWeight:700,background:"#4A148C",color:"#fff",borderRadius:10,padding:"2px 7px"}}>📋 Craft</span>}
                        </div>
                      </div>
                      <div style={{padding:"10px 14px"}}>
                        {hasDeg&&(
                          <>
                            <div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:2}}>DEGREE PROGRAMMES</div>
                            {data.deg.map((d,i)=>(
                              <div key={i} style={{padding:"5px 0",borderBottom:i<data.deg.length-1?`1px solid ${bdr}`:"none"}}>
                                <div style={{fontSize:12,color:txt,fontWeight:600}}>{d.prog}</div>
                                <div style={{fontSize:11,color:sub,marginTop:2}}>{d.cluster} · cutoff {d.cutoff}</div>
                              </div>
                            ))}
                          </>
                        )}
                        {hasDip&&(
                          <>
                            <div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:hasDeg?10:2}}>DIPLOMA PROGRAMMES</div>
                            {data.dip.map((d,i)=>(
                              <div key={i} style={{padding:"4px 0",borderBottom:i<data.dip.length-1?`1px solid ${bdr}`:"none",fontSize:12,color:sub}}>📘 {d}</div>
                            ))}
                          </>
                        )}
                        {hasCraft&&(
                          <>
                            <div style={{fontSize:10,fontWeight:800,color:"#90A4AE",marginBottom:6,marginTop:(hasDeg||hasDip)?10:2}}>CRAFT PROGRAMMES</div>
                            {data.craft.map((d,i)=>(
                              <div key={i} style={{padding:"4px 0",borderBottom:i<data.craft.length-1?`1px solid ${bdr}`:"none",fontSize:12,color:sub}}>📋 {d}</div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* ── DEGREE TAB ── */}
          {tab==="degree"&&(
            <>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                {[false,true].map(a=>(
                  <button key={String(a)} onClick={()=>setShowAll(a)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:12,background:showAll===a?"#006064":"#ECEFF1",color:showAll===a?"#fff":"#607D8B"}}>
                    {a?"All 15 Clusters":`✅ Qualifying (${qualDeg.length})`}
                  </button>
                ))}
              </div>
              {listToShow.length===0&&(
                <div style={{background:card,borderRadius:14,padding:24,textAlign:"center",boxShadow:"0 2px 8px #0001"}}>
                  <div style={{fontSize:28,marginBottom:8}}>📖</div>
                  <div style={{fontWeight:700,color:txt,marginBottom:6}}>No degree clusters qualify yet</div>
                  <div style={{fontSize:13,color:sub}}>Check the Diploma or Craft tabs for your options.</div>
                </div>
              )}
            </>
          )}

          {tab==="diploma"&&<div style={{background:"#E3F2FD",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#1565C0"}}>📘 Govt-funded. Fees: Ksh 10,000–30,000/yr. Upgradeable to degree later.</div>}
          {tab==="craft"&&<div style={{background:"#F3E5F5",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#4A148C"}}>📋 Practical skills. Fees: Ksh 5,000–15,000/yr. Progress to Diploma later.</div>}
          {tab==="artisan"&&<div style={{background:"#ECEFF1",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#37474F"}}>🛠️ Open to ALL candidates. Fees: Ksh 3,000–10,000/yr. 1-year trade programmes.</div>}

          {listToShow.map(c=>{
            const isDeg=tab==="degree";
            const ts=isDeg?(TIER_STYLES[c.tier]||TIER_STYLES["Below cutoff"]):null;
            return(
              <div key={c.id} style={{background:card,borderRadius:14,marginBottom:10,boxShadow:"0 2px 8px #0001",overflow:"hidden",opacity:(isDeg&&!c.qualifies)?0.6:1,border:`1.5px solid ${c.color}22`}}>
                <div style={{display:"flex",alignItems:"center",padding:"12px 14px",gap:10}}>
                  <span style={{fontSize:22}}>{c.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <div style={{fontSize:11,color:sub,marginTop:2}}>{c.desc||c.note}</div>
                    <div style={{fontSize:11,color:"#2E7D32",marginTop:2}}>💰 {isDeg?(c.fees?.gov||""):c.fees} · {isDeg?(c.fees?.duration||""):c.duration}</div>
                  </div>
                  {isDeg&&<div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:20,fontWeight:800,color:c.qualifies?c.color:"#B0BEC5"}}>{c.score.toFixed(1)}</div>
                    <div style={{fontSize:9,color:"#90A4AE"}}>/ ~{c.cutoff}</div>
                  </div>}
                </div>
                <div style={{display:"flex",alignItems:"center",padding:"0 14px 12px",gap:8,flexWrap:"wrap"}}>
                  {isDeg&&ts&&<span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,background:ts.bg,color:ts.color}}>{c.tier}</span>}
                  {isDeg&&!c.qualifies&&c.reasons[0]&&<span style={{fontSize:11,color:"#EF5350"}}>⚠ {c.reasons[0]}</span>}
                  {!isDeg&&<span style={{fontSize:11,color:sub,flex:1}}>{(c.progs||[]).length} programmes · {c.duration}</span>}
                  <button onClick={()=>{setSelected({...c,level:tab});setScreen("detail");}} style={{marginLeft:"auto",fontSize:12,fontWeight:700,padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:c.color,color:"#fff"}}>
                    View →
                  </button>
                </div>
              </div>
            );
          })}

          <button onClick={()=>setScreen("grades")} style={{width:"100%",marginTop:14,padding:14,borderRadius:10,border:"none",cursor:"pointer",background:"#ECEFF1",color:"#546E7A",fontWeight:700,fontSize:14}}>← Edit My Grades</button>
        </div>
      </div>
    );
  }

  // ── GRADES ──
  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#006064",padding:"14px 16px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>setScreen("splash")} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>Enter KCSE Grades</div>
          <div style={{fontSize:12,color:"#B2EBF2"}}>{filled} subject{filled!==1?"s":""} entered{meanGrade?` · Mean: ${meanGrade}`:""}</div>
        </div>
        <button onClick={()=>setDarkMode(!darkMode)} style={{background:"#fff3",border:"none",color:"#fff",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:15}}>{darkMode?"☀️":"🌙"}</button>
        {filled>=4&&<button onClick={()=>setScreen("results")} style={{background:"#FFB300",color:"#212121",border:"none",borderRadius:8,padding:"8px 12px",fontWeight:800,cursor:"pointer",fontSize:13}}>Analyse →</button>}
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"12px 12px 120px"}}>
        <div style={{background:"#E0F7FA",borderRadius:12,padding:"10px 14px",fontSize:13,color:"#006064",marginBottom:10}}>
          📋 Enter all subjects from your KNEC result slip. Grades are auto-saved to your device.
        </div>

        {Object.entries(SUBJECTS).map(([group,subjects])=>(
          <div key={group} style={{background:card,borderRadius:14,marginBottom:12,boxShadow:"0 2px 8px #0001",overflow:"hidden",border:`1px solid ${bdr}`}}>
            <div style={{background:"#006064",padding:"8px 14px",fontSize:11,fontWeight:700,color:"#B2EBF2",letterSpacing:.8}}>{group.toUpperCase()}</div>
            {subjects.map(subj=>(
              <div key={subj} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:`1px solid ${bdr}`}}>
                <span style={{fontSize:13,color:txt,flex:1,paddingRight:8}}>{subj}</span>
                <select value={grades[subj]||""} onChange={e=>setGrade(subj,e.target.value)}
                  style={{padding:"7px 6px",borderRadius:8,border:`1.5px solid ${grades[subj]?"#006064":"#CFD8DC"}`,fontSize:14,background:grades[subj]?"#E0F7FA":"#fff",color:grades[subj]?"#006064":"#90A4AE",fontWeight:grades[subj]?700:400,cursor:"pointer",minWidth:70,outline:"none"}}>
                  <option value="">—</option>
                  {ALL_GRADES.map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            ))}
          </div>
        ))}
        <button onClick={()=>setGrades({})} style={{width:"100%",padding:12,borderRadius:10,border:`1.5px solid ${bdr}`,background:"transparent",color:sub,fontWeight:700,cursor:"pointer",fontSize:14}}>🗑️ Clear All Grades</button>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:card,borderTop:`1px solid ${bdr}`,padding:"12px 16px",display:"flex",gap:10,boxSizing:"border-box"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:filled>=4?"#006064":"#B0BEC5"}}>
            {filled<4?`Enter ${4-filled} more subject${4-filled!==1?"s":""}`:`${filled} subjects ready ✓`}
          </div>
          <div style={{fontSize:11,color:sub}}>{filled>=4?`Mean: ${meanGrade} · Tap Analyse`:"Min 4 subjects required"}</div>
        </div>
        <button disabled={filled<4} onClick={()=>setScreen("results")} style={{padding:"12px 20px",borderRadius:10,border:"none",cursor:filled>=4?"pointer":"not-allowed",background:filled>=4?"#006064":"#B0BEC5",color:"#fff",fontWeight:800,fontSize:15}}>
          Analyse →
        </button>
      </div>
    </div>
  );
}