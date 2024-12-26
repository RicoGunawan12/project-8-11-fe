interface PageContent{
    content : string,
    page : string,
    pageId : string,
    title : string
}

export default interface Page{
    contentJSONEng : PageContent[],
    contentJSONIndo : PageContent[],
    [key: string]: PageContent[];
}