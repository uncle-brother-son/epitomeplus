import { setSitedata } from "./setSitedata";
import { setNavigation } from "./setNavigation";
import { setFooter } from "./setFooter";
import { setCategoryMetadata } from "./setCategoryMetadata";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { infoPage } from "./infoPage";
import { workType } from "./workType";

export const schemaTypes = [
    setSitedata,
    setNavigation,
    setFooter,
    setCategoryMetadata,
    homePage,
    aboutPage,
    infoPage,
    workType
]
