export interface AboutPage{
    pageId : string,
    titleEng : string,
    titleIndo : string,
    contentEng : string,
    contentIndo : string,
    whyIndo : string,
    whyEng : string,
    introduceIndo : string,
    introduceEng : string
}

interface WhyPageContent{
    content: string,
    contentId : string,
    photo : string
}

export interface WhyPage{
    whyId : string,
    whyContentJSONEng : WhyPageContent[]
    whyContentJSONIndo : WhyPageContent[]
}