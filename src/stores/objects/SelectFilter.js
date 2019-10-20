import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import { getSelectWhere, getDomainMap } from '../../utils/Utils';

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();

  load(featureLayer){
    super.load(featureLayer);
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = getDomainMap(domain);
    }
    featureLayer.queryFeatures({
      where: "1=1",
      returnDistinctValues: true,
      outFields: [this.field]
    }).then(res => {
      this.options = res.features.map(f => 
        f.attributes[this.field]
      ).sort();
      this.loaded = true;
    });
  }

  onValueChange(v){
    if(this.selectValue === v){
      this.selectValue = null;
    } else {
      this.selectValue = v;
    }
  }

  clear(){
    this.selectValue = null;
  }

  get where(){
    return getSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
  }

  get optionSet(){
    return new Set(this.options);
  }

}

decorate(SelectFilter, {
  options: observable,
  loaded: observable,
  selectValue: observable,
  load: action.bound,
  where: computed,
  onValueChange: action.bound,
  clear: action.bound,
  optionSet: computed
})

export default SelectFilter;