import { Helmet } from 'react-helmet-async';
/**
 * Helmet collects all assets into <head>
 * Not adding ValidateReact a non-rendering entity
 */
export default function PageHead({ title = 'Kutubi' }) {
  return (
    <Helmet>
      <title> {title} </title>
    </Helmet>
  );
}
