/** Fictional QA fixtures only; never personal or verified household information. */
export const qaGroups:readonly (readonly [string,readonly string[]])[] = [
 ['Kitchen',['Coffee filters','Blender attachments','Water filter replacements','Holiday serving tray','Spare dish towels','Baking thermometer']],
 ['Garage',['Extension cord','Tire pressure gauge','Paint touch-up kit','Camping lantern','Garden gloves','Spare batteries']],
 ['Documents',['Appliance manuals','Warranty folder','Vehicle maintenance log','Home inventory checklist','Insurance contact template','Moving supplies list']],
 ['Maintenance',['HVAC filter size note','Smoke alarm testing checklist','Dryer lint care','Water shutoff map','Caulk inspection','Outdoor faucet covers']],
 ['Garden',['Pruning shears','Seed packets','Plant tags','Hose nozzle','Potting gloves','Watering schedule']],
 ['Travel',['Packing cubes','Travel adapters','Luggage scale','Toiletry bottles','Trip checklist','Travel first-aid pouch']],
 ['Pets',['Pet carrier','Grooming brush','Spare leash','Travel bowl','Pet blanket','Pet supply checklist']],
 ['Electronics',['HDMI cable','USB-C charger','Router documentation','Wireless mouse','Charging cable labels','Remote batteries']],
 ['Seasonal',['Gift wrap','Holiday lights','Winter blankets','Picnic blanket','Rain ponchos','Decoration hooks']],
 ['Cleaning',['Microfiber cloths','Vacuum attachments','Mop pads','Window squeegee','Spray bottles','Dusting brush']],
 ['Tools',['Tape measure','Spirit level','Stud finder','Picture hanging kit','Allen keys','Flashlight']],
 ['Family Activities',['Board games','Jigsaw puzzles','Picnic utensils','Craft scissors','Coloring supplies','Photo album sleeves']],
 ['Vehicles',['Windshield scraper','Car wash towels','Jumper cables','Tire inflator','Vehicle flashlight','Registration checklist']],
 ['Safety',['Emergency flashlight','First-aid supplies','Water rotation checklist','Fire extinguisher check','Emergency contacts template','Exit plan practice']],
 ['Home Office',['Printer paper','Label maker','Sticky notes','Stapler refills','Document sleeves','Notebook archive']]
];
export const qaCount=qaGroups.reduce((sum,[,items])=>sum+items.length,0);
export const qaAnswers:readonly (readonly string[])[] = [
 ['Upper pantry basket','Island drawer, second from top','Laundry utility cabinet','Pantry top shelf, wrapped','Lower kitchen linen drawer','Baking supplies bin'],
 ['Left garage wall hook','Small red toolbox','Paint crate on storage rack','Emergency tote on rear shelf','Garden rack hook','Sealed battery organizer'],
 ['Office cabinet, manuals binder','Warranty binder on office shelf','Vehicle file in office drawer','Blue inventory binder','Emergency binder, blank template','Household notebook'],
 ['Check installed filter label before purchase','Test button on each alarm, follow manual','Clean lint screen after every load','See household map; verify valve onsite','Inspect sink and tub seals monthly','Seasonal bin on garage rack'],
 ['Garden shed tool caddy','Dry seed storage box','Garden notebook pouch','Patio storage box','Green garden tote','Garden journal on patio shelf'],
 ['Large suitcase interior pocket','Travel electronics pouch','Clipped inside suitcase','Bathroom cabinet travel bag','Travel binder in office','Luggage accessory pouch'],
 ['Folded in hall closet','Laundry pet supply basket','Entryway pet drawer','Hall closet travel pet bag','Laundry utility shelf','Attached to pet supply bin'],
 ['Labeled office cable organizer','Office electronics drawer','Office binder, no passwords stored','Desk accessory bin','Cable organizer kit','Garage battery box'],
 ['Hall closet storage tube','Labeled garage holiday tote','Bedroom linen bag','Garage outdoor tote','Entryway emergency bin','Decoration accessories box'],
 ['Laundry utility basket','Hall closet door rack','Laundry cabinet','Cleaning caddy','Labeled cleaning bin','Hall closet cleaning caddy'],
 ['Top toolbox tray','Hand tools drawer','Tool case on garage shelf','Hardware organizer','Separate metric and imperial sleeves','Utility closet charging shelf'],
 ['Living room game cabinet','Lower living room shelf','Outdoor dining tote','Activity closet craft box','Art organizer','Office keepsake drawer'],
 ['Vehicle emergency bag','Garage auto-care bin','Garage labeled vehicle kit','Auto equipment tote','Car safety kit','Office vehicle binder, no IDs'],
 ['Hall closet emergency tote','Hall bathroom first-aid cabinet','Garage emergency bin','Kitchen safety station; check manual','Preparedness binder blank sheet','Living room household checklist'],
 ['Bottom office file drawer','Desk drawer','Stationery organizer','Small stationery tin','Office binder shelf','Office shelf sorted by year']
];
