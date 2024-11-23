import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import prisma from '../../lib/prisma';
import styles from '../p/PostBody.module.css';
import Button from '../../components/Button';
import BlockMenu from '../../components/BlockMenu';
import BlockEditor from '../../components/BlockEditor';
import { Block, BlockType } from '../../types/EditorTypes';
import { v4 as uuidv4 } from 'uuid';
import { parseContent, serializeBlocks } from '../../utils/blockUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }

  const post = await prisma!.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  };
};

const EditPost: React.FC<{ post: any }> = ({ post }) => {
  const [title, setTitle] = useState(post.title);
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return parseContent(post.content);
    } catch (e) {
      return [{
        id: uuidv4(),
        type: 'text',
        content: post.content || ''
      }];
    }
  });
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [insertIndex, setInsertIndex] = useState<number>(0);
  const { data: session, status } = useSession();

  const addBlock = (type: BlockType, index: number) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: '',
    };

    setBlocks(prev => [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1)
    ]);
  };

  const updateBlock = (id: string, data: Partial<Block>) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, ...data } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const serializedContent = serializeBlocks(blocks);
      const body = { 
        title, 
        content: serializedContent
      };
      
      await fetch(`/api/post/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      window.location.href = post.published ? `/p/${post.id}` : '/drafts';
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  return (
    <Layout>
      <div className={styles.formContainer}>
        <form onSubmit={submitData}>
          <input
            className={styles.input}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.blocks}
                >
                  {blocks.map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${styles.blockWrapper} ${
                            snapshot.isDragging ? styles.dragging : ''
                          }`}
                        >
                          <div className={styles.blockControls}>
                            <div
                              {...provided.dragHandleProps}
                              className={styles.dragHandle}
                            >
                              ⋮⋮
                            </div>
                            <button
                              type="button"
                              className={styles.deleteBlockButton}
                              onClick={() => deleteBlock(block.id)}
                            >
                              ×
                            </button>
                          </div>
                          <BlockEditor
                            block={block}
                            onChange={(data) => updateBlock(block.id, data)}
                            onDelete={() => deleteBlock(block.id)}
                          />
                          <button
                            type="button"
                            className={styles.addBlockButton}
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuPosition({ x: rect.left, y: rect.bottom });
                              setShowBlockMenu(true);
                              setInsertIndex(index + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {showBlockMenu && (
            <BlockMenu
              onSelect={(type) => addBlock(type, insertIndex)}
              onClose={() => setShowBlockMenu(false)}
            />
          )}
          <div className={styles.actions}>
            <Button disabled={!blocks.length || !title} type="submit">
              Update {post.published ? 'Post' : 'Draft'}
            </Button>
            <a className={styles.back} href="#" onClick={() => Router.push(post.published ? `/p/${post.id}` : '/drafts')}>
              or Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;