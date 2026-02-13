
export interface ITestcase {
    input: string;
    output: string;
}
export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    testcases: ITestcase[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProlemReponse {
    data: IProblemDetails;
    message: string;
    success: boolean;
}

export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python",
}


export interface ISubmissionJob {
    submissionId: string;
    problem: IProblemDetails;
    code: string;
    language: SubmissionLanguage;
}

export interface TestCase {
    _id: string;
    input: string;
    output: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    diffculty: string;
    editorial?: string;
    testcases: TestCase[]
    createdAt: string;
    updatedAt: string;
}
export interface EvaluationJob {
    submissionId: string;
    code: string;
    language: "python" | "cpp";
    problem: Problem;
}

export interface EvaluationResult {
    status: string;
    output: string | undefined;
}
