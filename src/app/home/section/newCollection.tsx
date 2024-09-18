import Image from 'next/image';
import React from 'react'

const NewCollection = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="text-black text-8xl font-bold text-center">
        New Collection
      </div>
      <div className="text-black text-center text-lg mt-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis non,
        nihil alias vitae expedita autem numquam animi culpa voluptatum
        blanditiis.
      </div>
      <div className="flex w-2/3 justify-around mt-6">
        <Image
          src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455620360_18450080116031145_8492434641316228714_n.jpg?stp=dst-jpg_e35_p1080x1080&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=dGtuz8uNiTgQ7kNvgF1NkV6&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDYwNjc5MTk5NA%3D%3D.3-ccb7-5&oh=00_AYCjEq31tFVrEou4pCLViSnW3VgGxE8OUvTE7aGQPt6pnA&oe=66E716D9&_nc_sid=8f1549"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
        <Image
          src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455707271_18450080125031145_315727109677010934_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=1lH-joe5x-gQ7kNvgEQA2hj&_nc_gid=45ad532f3420433ba4d988ff5b3cf2ef&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDc5MTU2Nzk0Ng%3D%3D.3-ccb7-5&oh=00_AYDUQ2VUrcnQLIrjHVTAgAyIzkBBt2h9Pu1yo9miwnN4JQ&oe=66E6F713&_nc_sid=8f1549"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
        <Image
          src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/455789176_18450080137031145_5719792645966362196_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTYuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=yGltols5s4EQ7kNvgFxTm2y&_nc_gid=45ad532f3420433ba4d988ff5b3cf2ef&edm=AEhyXUkAAAAA&ccb=7-5&ig_cache_key=MzQzNTEyOTY0MDYxNTI1NTQ4MA%3D%3D.3-ccb7-5&oh=00_AYAdFey_v48Cctv3xezrMWbyHyI9Ok5lazE4_Z6z80wt0w&oe=66E720A1&_nc_sid=8f1549"
          width={400}
          height={400}
          alt="logo pic"
          className="aspect-square"
        />
      </div>
    </div>
  );
}

export default NewCollection
