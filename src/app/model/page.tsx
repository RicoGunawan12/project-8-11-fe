interface PageContent{
    content : string,
    page : string,
    pageId : string,
    title : string
}

export interface Page{
    contentJSONEng : PageContent[],
    contentJSONIndo : PageContent[],
    [key: string]: PageContent[];
}