import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
    username: string;
  } | null;
  content: string;
  published: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.author?.username}/${post.slug}`;
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      {post.published && (
        <div>
          <p>Shareable link:</p>
          <input type="text" value={shareableLink} readOnly />
        </div>
      )}
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;