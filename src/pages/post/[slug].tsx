import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import Header from '../../components/Header';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import type { Post as PostType } from '../../../lib/posts';

type Props = {
  post: PostType;
};

type QueryParams = {
  slug?: string;
};

const Post: NextPage<Props> = ({ post }) => {
  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>{post.metadata.title}</title>
      </Head>

      <Header />

      <div className="py-10">
        <h1 className="text-4xl font-bold font-serif">{post.metadata.title}</h1>
        <div className="flex gap-1 pt-2">
          {post.metadata.tags.map((tag: any, key: any) => (
            <p className="italic text-sm font-serif" key={key}>{`#${tag}`}</p>
          ))}
        </div>

        <div className="pt-6">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="my-4 text-4xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="my-4 text-2xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="my-4 text-xl font-bold">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="my-4 text-lg font-bold">{children}</h4>
              ),
              p: ({ children }) => <p className="my-4">{children}</p>,
              code: ({ children, className }) => {
                const language = className?.split('-')[1];

                return language ? (
                  <SyntaxHighlighter language={language}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 p-1 rounded">{children}</code>
                );
              },
            }}
          >
            {post.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  const paths = posts.map((post) => ({ params: { slug: post.metadata.slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, QueryParams> = async ({
  params,
}) => {
  const post = await getPostBySlug(params?.slug);

  if (!post) {
    throw new Error(
      "This post doesn't exist! Please, try again with some correct slug!"
    );
  }

  return {
    props: {
      post,
    },
  };
};