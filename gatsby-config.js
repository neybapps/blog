const {stripHtmlTags} = require('./src/utils');
const {decode} = require('he');
require('dotenv').config();

module.exports = {
  pathPrefix: '/blog',
  siteMetadata: {
    siteUrl: 'https://wikiexplain-blog.netlify.app'
  },
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-wordpress-experimental',
      options: {
        url:
          process.env.WORDPRESS_URL_DEV ||
          'http://104.154.128.71/graphql',
        debug: {
          graphql: {
            showQueryVarsOnError: true,
            copyQueryOnError: true,
            panicOnError: true
          }
        },
        html: {
          useGatsbyImage: false
        },
        type: {
          CareersSlider2: {
            exclude: true
          },
          CareersHeroSlider: {
            exclude: true
          },
          CareersSlider3: {
            exclude: true
          },
          Collection: {
            exclude: true
          },
          FeedItem: {
            exclude: true
          },
          FeedItemType: {
            exclude: true
          },
          TeamMember: {
            exclude: true
          },
          User: {
            excludeFieldNames: null
          },
          Post: {
            limit: process.env.NODE_ENV === 'production' ? undefined : 20
          }
        }
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-74643563-11'
      }
    },
    {
      resolve: '@gatsby-contrib/gatsby-plugin-elasticlunr-search',
      options: {
        fields: ['title', 'content'],
        resolvers: {
          WpPost: {
            title: (node) => decode(node.title),
            content: (node) => stripHtmlTags(node.content),
            excerpt: (node) => stripHtmlTags(node.excerpt),
            uri: (node) => node.uri,
            categories: (node, getNode) =>
              node.categories.nodes.map((category) => getNode(category.id)),
            author: (node) => node.author.node
          }
        }
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            wp {
              generalSettings {
                title
                description
              }
            }
          }
        `,
        setup: ({query, ...rest}) => {
          const {title, description} = query.wp.generalSettings;
          return {
            title,
            description,
            site_url: query.site.siteMetadata.siteUrl,
            ...rest
          };
        },
        feeds: [
          {
            serialize: ({query}) => {
              const {siteUrl} = query.site.siteMetadata;
              return query.allWpPost.nodes.map((node) => {
                const url = siteUrl + node.path;
                return {
                  title: node.title,
                  description: stripHtmlTags(node.excerpt),
                  date: node.date,
                  url,
                  guid: url,
                  custom_elements: [{'content:encoded': node.content}]
                };
              });
            },
            query: `
              {
                allWpPost {
                  nodes {
                    content
                    excerpt
                    title
                    date
                    path: uri
                  }
                }
              }
            `,
            output: '/rss.xml'
          }
        ]
      }
    }
  ]
};
