export interface SuccessOrFailTypes {
    isSuccess ?: ( value ?: unknown ) => void;
    isFail ?: ( value ?: unknown ) => void;
}

export interface NewCategory extends SuccessOrFailTypes  {
    name : string
    url : string
    companyId : string
}