import Byline from './byline';
import Highlighter from 'react-highlight-words';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {HeadingLink} from './ui';
import {colors} from '@apollo/space-kit/colors';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  ':not(:last-child)': {
    marginBottom: 60
  },
  h3: {
    marginBottom: 12
  },
  p: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    marginBottom: 16,
    overflow: 'hidden',
    mark: {
      backgroundColor: colors.indigo.lightest,
      color: colors.indigo.darker,
      fontWeight: 700
    }
  }
});

export default function SearchPost(props) {
  const {content, id, slug, title, author} = props.post;
  const termIndex = content.toLowerCase().indexOf(props.term.toLowerCase());
  const excerpt = content.slice(termIndex);
  return (
    <Wrapper key={id}>
      <h3>
        <HeadingLink to={'/' + slug}>{title}</HeadingLink>
      </h3>
      <p>
        <Highlighter textToHighlight={excerpt} searchWords={[props.term]} />
      </p>
      <Byline size="sm" author={author} />
    </Wrapper>
  );
}

SearchPost.propTypes = {
  post: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired
};