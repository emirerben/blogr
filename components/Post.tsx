import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import styles from './Post.module.css'

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
    username: string;
    createdAt: string | null;
    updatedAt: string | null;
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
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <div className={styles.post} onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2 className={styles.title}>{post.title}</h2>
      <span className={styles.line}></span>
      <span className={styles.date}>{formattedDate}</span>
    </div>
  );
};

export default Post;