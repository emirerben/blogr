import React, { useState, useRef, useEffect } from "react";
import Router from "next/router";
import styles from './Post.module.css'
import Button from './Button';

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

const Post: React.FC<{ post: PostProps; onDelete: (id: string) => void }> = ({ post, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [deletePosition, setDeletePosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  const handleDelete = () => {
    onDelete(post.id);
  };

  const updateDeletePosition = (e: React.MouseEvent) => {
    if (postRef.current) {
      const rect = postRef.current.getBoundingClientRect();
      setDeletePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    updateDeletePosition(e);
    timeoutRef.current = setTimeout(() => setShowDelete(true), 1000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showDelete) {
      updateDeletePosition(e);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDelete(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={postRef}
      className={styles.post} 
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className={styles.title}>{post.title}</h2>
      <span className={styles.line}></span>
      <span className={styles.date}>{formattedDate}</span>
      {showDelete && (
        <div 
          className={styles.deleteButtonContainer}
          style={{
            left: `${deletePosition.x}px`,
            top: `${deletePosition.y}px`,
          }}
        >
          <Button 
            className={styles.deleteButton} 
            onClick={handleDelete}
          >
            🗑️
          </Button>
        </div>
      )}
    </div>
  );
};

export default Post;