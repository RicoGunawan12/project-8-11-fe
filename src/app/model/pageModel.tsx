interface PageContent{
    content : string,
    page : string,
    pageId : string,
    title : string,
    bestNumber1 ?: string
    bestNumber2 ?: string
    bestNumber3 ?: string
    bestTitle1 ?: string
    bestTitle2 ?: string
    bestTitle3 ?: string
}

export default interface Page{
    contentJSONEng : PageContent[],
    contentJSONIndo : PageContent[],
    [key: string]: PageContent[];
}