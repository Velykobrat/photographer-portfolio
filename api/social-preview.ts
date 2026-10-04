export default {
  fetch() {
    return new Response(
      'Social preview function works',
      {
        status: 200,
        headers: {
          'Content-Type':
            'text/plain; charset=utf-8',
        },
      }
    );
  },
};