import axios from 'axios';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getJudge0languageId = (language) => {
  const languageMap = {
    CPP: 54,
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language] || null;
};

export const getLanguageName = (languageId) => {
  const languageIdMap = {
    54: 'CPP',
    71: 'PYTHON',
    62: 'JAVA',
    63: 'JAVASCRIPT',
  };
  return languageIdMap[languageId] || null;
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions: submissions,
    },
  );

  console.log('Submission Result: ', data);

  return data;
};

export const poolbatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(','),
          base_encoded: false,
        },
      },
    );

    const results = data.submissions;

    const isAllDone = results.every((result) => {
      return result.status.id !== 1 && result.status.id !== 2;
    });
    if (isAllDone) return results;

    await sleep(2000);
  }
};