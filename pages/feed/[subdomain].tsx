import React from "react"
import { GetServerSideProps } from "next"
import Layout from "../../components/Layout"
import Post, { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Context:", context); // Debug log

  const subdomain = context.params?.subdomain as string | undefined;
  
    if (!subdomain) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  console.log("Subdomain:", subdomain); // Debug log

  const feed = await prisma.post.findMany({
    where: { 
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return {
    props: { feed, subdomain },
  };
};

type Props = {
  feed: PostProps[]
  subdomain: string
}

const Blog: React.FC<Props> = ({ feed, subdomain }) => {
  return (
    <Layout>
      <div className="page">
        <h1>{subdomain}'s Blog</h1>
        <main>
          {feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }
        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog






// import React from "react"
// import { GetStaticProps } from "next"
// import Layout from "../components/Layout"
// import Post, { PostProps } from "../components/Post"
// import prisma from "../lib/prisma"

// export const getStaticProps: GetStaticProps = async () => {
//   const feed = await prisma.post.findMany({
//     where: { published: true },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return {
//     props: { feed },
//     revalidate: 10,
//   };
// };

// type Props = {
//   feed: PostProps[]
// }

// const Blog: React.FC<Props> = (props) => {
//   return (
//     <Layout>
//       <div className="page">
//         <h1>Public Feed</h1>
//         <main>
//           {props.feed.map((post) => (
//             <div key={post.id} className="post">
//               <Post post={post} />
//             </div>
//           ))}
//         </main>
//       </div>
//       <style jsx>{`
//         .post {
//           background: white;
//           transition: box-shadow 0.1s ease-in;
//         }

//         .post:hover {
//           box-shadow: 1px 1px 3px #aaa;
//         }

//         .post + .post {
//           margin-top: 2rem;
//         }
//       `}</style>
//     </Layout>
//   )
// }

// export default Blog
