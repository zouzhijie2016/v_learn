<template>
    <div class="list">
        <el-select v-model="form.value22" placeholder="请选择">

            <el-option
                    v-for="item in options222"
                    :key="item.value1"
                    :label="item.label1"
                    :value="item.value1">
            </el-option>
        </el-select>
        <button @click="mytest" class="upsidebtn">xxxxx</button>

        <el-table v-if="tableData6.length"
                  :data="tableData6"
                  border
                  height="200"
                  :summary-method="getSummaries"
                  show-summary
                  style="width: 100%; margin-top: 20px;">
            <template>
                <el-table-column v-for="n in 4" :key="n" :label="columnNames[n]"
                                 :prop="columnNames[n]"></el-table-column>
            </template>
            <!--<el-table-column-->
            <!--prop="id"-->
            <!--label="ID"-->
            <!--width="180">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="name"-->
            <!--label="姓名">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="amount1"-->
            <!--label="数值 1（元）">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="amount2"-->
            <!--label="数值 2（元）">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--prop="amount3"-->
            <!--label="数值 3（元）">-->
            <!--</el-table-column>-->
        </el-table>
        <p></p>
        <el-input-number :controls="false" :debounce="100"></el-input-number>
        <p></p>
        <el-radio-group v-model="radio2">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
        </el-radio-group>
        <p></p>
        <el-checkbox>备选项</el-checkbox>
        <p></p>
        <el-input style="width: 20%;" placeholder="请输入内容"></el-input>
        <input type="number" class="common_theme" style="width: 20%;" v-number.unsign v-model="myDirectiveValue"
               placeholder="请输入内容"></input>
        <!--<input type="number" pattern="[0-9]">-->
        <p></p>
        <el-select v-model="value" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <p></p>
        <el-popover
                ref="popover1"
                placement="top-start"
                title="标题"
                width="200"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        </el-popover>

        <el-popover
                ref="popover2"
                placement="bottom"
                title="标题"
                width="200"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        </el-popover>

        <el-button v-popover:popover1>hover 激活</el-button>
        <el-button v-popover:popover2>click 激活</el-button>
        <p></p>
        <el-cascader
                :options="options_cascader"
                change-on-select
        ></el-cascader>
        <p></p>
        <el-time-select v-model="time_value1"
                        :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '18:30'
                              }"
                        placeholder="选择时间">
        </el-time-select>
        <p></p>
        <el-date-picker
                v-model="date_value6"
                type="datetime"
                placeholder="选择日期范围">
        </el-date-picker>
        <p></p>
        <el-date-picker
                v-model="datetime_value1"
                type="daterange"
                placeholder="选择日期时间">
        </el-date-picker>
        <p></p>
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--drag-->
        <!--action="https://jsonplaceholder.typicode.com/posts/"-->
        <!--multiple>-->
        <!--<i class="el-icon-upload"></i>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
        <!--</el-upload>-->
        <el-transfer v-model="transfer_value1" :data="transfer_data"></el-transfer>
        <p></p>
        <el-form ref="form" :model="form_test" label-width="80px">
            <el-form-item label="活动名称">
                <el-input v-model="form_test.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="form_test.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form_test.date1"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form_test.date2"
                                    style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="活动性质">
                <el-checkbox-group v-model="form_test.type">
                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
                <el-radio-group v-model="form_test.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
                <el-input type="textarea" v-model="form_test.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        <p></p>
        <el-tree :data="tree_data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        <el-pagination
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
        </el-pagination>
        <p></p>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="一致性 Consistency" name="1">
                <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
            <el-collapse-item title="反馈 Feedback" name="2">
                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item title="效率 Efficiency" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="可控 Controllability" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
        <p></p>
        <el-select
                style="min-width: 300px;"
                v-model="mutilvalue"
                multiple
                filterable
                remote
                reserve-keyword
                collapse-tags
                placeholder="请输入关键词"
                :remote-method="remoteMethod">
            <el-option
                    v-for="item in mutiloptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-select
                style="min-width: 300px;"
                v-model="mutilvalue"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod">
            <el-option
                    v-for="item in mutiloptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import Vue from 'vue'
import test from './test.vue'

let TestConstructor = Vue.extend(test)

let testInstacne = new TestConstructor({
    data: {}
})
testInstacne.vm = testInstacne.$mount()
document.body.appendChild(testInstacne.vm.$el)

export default {
    data () {
        const generateData = _ => {
            const data = []
            for (let i = 1; i <= 15; i++) {
                data.push({
                    key: i,
                    label: `备选项 ${i}`,
                    disabled: i % 4 === 0
                })
            }
            return data
        }
        return {
            myDirectiveValue: 10,
            columnNames: {
                1: 'id',
                2: 'name',
                3: 'amount1',
                4: 'amount2',
                5: 'amount3'
            },
            tree_data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            form_test: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            options222: [],
            form: {
                value22: ''
            },
            tableData6: [{
                id: '12987122',
                name: '王小虎',
                amount1: '234',
                amount2: '3.2',
                amount3: 10
            }, {
                id: '12987123',
                name: '王小虎',
                amount1: '165',
                amount2: '4.43',
                amount3: 12
            }, {
                id: '12987124',
                name: '王小虎',
                amount1: '324',
                amount2: '1.9',
                amount3: 9
            }, {
                id: '12987125',
                name: '王小虎',
                amount1: '621',
                amount2: '2.2',
                amount3: 17
            }, {
                id: '12987126',
                name: '王小虎',
                amount1: '539',
                amount2: '4.1',
                amount3: 15
            }],
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: '',
            radio2: 3,
            options_cascader: [{
                value: 'zhinan',
                label: '指南',
                children: [{
                    value: 'shejiyuanze',
                    label: '设计原则',
                    children: [{
                        value: 'yizhi',
                        label: '一致'
                    }, {
                        value: 'fankui',
                        label: '反馈'
                    }, {
                        value: 'xiaolv',
                        label: '效率'
                    }, {
                        value: 'kekong',
                        label: '可控'
                    }]
                }, {
                    value: 'daohang',
                    label: '导航',
                    children: [{
                        value: 'cexiangdaohang',
                        label: '侧向导航'
                    }, {
                        value: 'dingbudaohang',
                        label: '顶部导航'
                    }]
                }]
            }, {
                value: 'zujian',
                label: '组件',
                children: [{
                    value: 'basic',
                    label: 'Basic',
                    children: [{
                        value: 'layout',
                        label: 'Layout 布局'
                    }, {
                        value: 'color',
                        label: 'Color 色彩'
                    }, {
                        value: 'typography',
                        label: 'Typography 字体'
                    }, {
                        value: 'icon',
                        label: 'Icon 图标'
                    }, {
                        value: 'button',
                        label: 'Button 按钮'
                    }]
                }, {
                    value: 'form',
                    label: 'Form',
                    children: [{
                        value: 'radio',
                        label: 'Radio 单选框'
                    }, {
                        value: 'checkbox',
                        label: 'Checkbox 多选框'
                    }, {
                        value: 'input',
                        label: 'Input 输入框'
                    }, {
                        value: 'input-number',
                        label: 'InputNumber 计数器'
                    }, {
                        value: 'select',
                        label: 'Select 选择器'
                    }, {
                        value: 'cascader',
                        label: 'Cascader 级联选择器'
                    }, {
                        value: 'switch',
                        label: 'Switch 开关'
                    }, {
                        value: 'slider',
                        label: 'Slider 滑块'
                    }, {
                        value: 'time-picker',
                        label: 'TimePicker 时间选择器'
                    }, {
                        value: 'date-picker',
                        label: 'DatePicker 日期选择器'
                    }, {
                        value: 'datetime-picker',
                        label: 'DateTimePicker 日期时间选择器'
                    }, {
                        value: 'upload',
                        label: 'Upload 上传'
                    }, {
                        value: 'rate',
                        label: 'Rate 评分'
                    }, {
                        value: 'form',
                        label: 'Form 表单'
                    }]
                }, {
                    value: 'data',
                    label: 'Data',
                    children: [{
                        value: 'table',
                        label: 'Table 表格'
                    }, {
                        value: 'tag',
                        label: 'Tag 标签'
                    }, {
                        value: 'progress',
                        label: 'Progress 进度条'
                    }, {
                        value: 'tree',
                        label: 'Tree 树形控件'
                    }, {
                        value: 'pagination',
                        label: 'Pagination 分页'
                    }, {
                        value: 'badge',
                        label: 'Badge 标记'
                    }]
                }, {
                    value: 'notice',
                    label: 'Notice',
                    children: [{
                        value: 'alert',
                        label: 'Alert 警告'
                    }, {
                        value: 'loading',
                        label: 'Loading 加载'
                    }, {
                        value: 'message',
                        label: 'Message 消息提示'
                    }, {
                        value: 'message-box',
                        label: 'MessageBox 弹框'
                    }, {
                        value: 'notification',
                        label: 'Notification 通知'
                    }]
                }, {
                    value: 'navigation',
                    label: 'Navigation',
                    children: [{
                        value: 'menu',
                        label: 'NavMenu 导航菜单'
                    }, {
                        value: 'tabs',
                        label: 'Tabs 标签页'
                    }, {
                        value: 'breadcrumb',
                        label: 'Breadcrumb 面包屑'
                    }, {
                        value: 'dropdown',
                        label: 'Dropdown 下拉菜单'
                    }, {
                        value: 'steps',
                        label: 'Steps 步骤条'
                    }]
                }, {
                    value: 'others',
                    label: 'Others',
                    children: [{
                        value: 'dialog',
                        label: 'Dialog 对话框'
                    }, {
                        value: 'tooltip',
                        label: 'Tooltip 文字提示'
                    }, {
                        value: 'popover',
                        label: 'Popover 弹出框'
                    }, {
                        value: 'card',
                        label: 'Card 卡片'
                    }, {
                        value: 'carousel',
                        label: 'Carousel 走马灯'
                    }, {
                        value: 'collapse',
                        label: 'Collapse 折叠面板'
                    }]
                }]
            }, {
                value: 'ziyuan',
                label: '资源',
                children: [{
                    value: 'axure',
                    label: 'Axure Components'
                }, {
                    value: 'sketch',
                    label: 'Sketch Templates'
                }, {
                    value: 'jiaohu',
                    label: '组件交互文档'
                }]
            }],
            time_value1: '',
            date_value6: '',
            datetime_value1: '',
            transfer_data: generateData(),
            transfer_value1: [1, 4],
            activeNames: ['1'],
            currentPage4: 1,
            mutilvalue:[],
            mutiloptions:[],
            mutillist:[],
            states: ["Alabama", "Alaska", "Arizona",
                "Arkansas", "California", "Colorado",
                "Connecticut", "Delaware", "Florida",
                "Georgia", "Hawaii", "Idaho", "Illinois",
                "Indiana", "Iowa", "Kansas", "Kentucky",
                "Louisiana", "Maine", "Maryland",
                "Massachusetts", "Michigan", "Minnesota",
                "Mississippi", "Missouri", "Montana",
                "Nebraska", "Nevada", "New Hampshire",
                "New Jersey", "New Mexico", "New York",
                "North Carolina", "North Dakota", "Ohio",
                "Oklahoma", "Oregon", "Pennsylvania",
                "Rhode Island", "South Carolina",
                "South Dakota", "Tennessee", "Texas",
                "Utah", "Vermont", "Virginia",
                "Washington", "West Virginia", "Wisconsin",
                "Wyoming"
            ]
        }
    },
    watch: {
        myDirectiveValue () {
            console.log('changed')
        }
    },
    created () {
        document.title = 'Inventory | Warehouse | OCMS-BIM'
    },
    mounted () {
        this.mutillist = this.states.map(item => {
            return { value: item, label: item };
        });
        console.log('execute demo table mounted!')
    },
    methods: {
        handleNodeClick (data) {
            console.log(data)
        },
        getSummaries (param, x, d) {
            const {columns, data} = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总价'
                    return
                }
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] += ' 元'
                } else {
                    sums[index] = 'N/A'
                }
            })
            return sums
        },
        mytest () {
            this.options222.splice(0)
            this.options222 = this.options222.concat([{
                value1: '选项1',
                label1: '黄金糕'
            }, {
                value1: '选项2',
                label1: '双皮奶'
            }, {
                value1: '选项3',
                label1: '蚵仔煎'
            }, {
                value1: '选项4',
                label1: '龙须面'
            }, {
                value1: '选项5',
                label1: '北京烤鸭'
            }])

            this.tableData6[0].amount3 = Math.floor(Math.random() * 100)
        },
        onSubmit () {

        },
        remoteMethod(query) {
            if (query !== '') {
                setTimeout(() => {
                    this.mutiloptions = this.mutillist.filter(item => {
                        return item.label.toLowerCase()
                          .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                this.mutiloptions = [];
            }
        }
    }
}

</script>
<style scoped>
    a {
        /*display: block;*/
    }

    .list {
        margin: 0 auto;
        /*text-align: center;*/
    }

    .upsidebtn {
        transform: rotate(180deg);
        display: flex;
        -webkit-transition: all .5s;
        -moz-user-select: none;
        background: linear-gradient(to bottom, white, black);
    }

    .number {
        ime-mode: disabled
    }

</style>
<style>
    .el-upload__input {
        display: none !important;
    }
</style>