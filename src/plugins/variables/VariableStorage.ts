import { ConstantVariable } from "@/plugins/variables/ConstantVariable";
import { ComputedVariable } from "@/plugins/variables/ComputedVariable";
import { QueryVariable } from "@/plugins/variables/QueryVariable";
import { RequestVariable } from "@/plugins/variables/RequestVariable";
import { TimeVariable } from "./TimeVariable";
import { SourceType }  from '@/types/enum';

export class VariableStorage {
  private variables: { [key: string]: any } = {};

  createVariable(name: string, config: INewVariableConfig) {
    console.log(config)
    if (config.type === SourceType.Constant) {
      const variable = new ConstantVariable(name, this, config as IConstantVariableConfig);
      this.variables[name] = variable;
    }

    if (config.type === SourceType.Expression) {
      const variable = new ComputedVariable(name, this, config as IComputedVariableConfig);
      this.variables[name] = variable;
    }

    if (config.type === SourceType.QueryParameter) {
      const variable = new QueryVariable(name, this, config as IQueryVariableConfig);
      this.variables[name] = variable;
    }

    if (config.type === SourceType.AsyncParameters) {
      console.log('creating request variable');
      const variable = new RequestVariable(name, this, config as IRequestVaribleConfig);
      this.variables[name] = variable;
    }

    if (config.type === SourceType.Time) {
      const variable = new TimeVariable(name, this, config as IConstantVariableConfig);
      this.variables[name] = variable;
    }

    return this.variables[name];
  }

  removeVariable(name: string) {
    if (this.variables[name]) {
      this.variables[name].clearInterval();
    }
    delete this.variables[name];
  }

  getVariable(name: string) {
    return this.variables[name];
  }

  clearStorage() {
    this.variables = {};
  }
}