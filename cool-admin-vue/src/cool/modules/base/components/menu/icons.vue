<template>
	<div class="cl-menu-icons__wrap">
		<el-popover
			v-model:visible="visible"
			placement="bottom-start"
			width="480px"
			popper-class="cl-menu-icons"
		>
			<el-row :gutter="10" class="list scroller1">
				<el-col v-for="(item, index) in list" :key="index" :span="3" :xs="4">
					<el-button
						size="mini"
						:class="{ 'is-active': item === name }"
						@click="onChange(item)"
					>
						<icon-svg :name="item" />
					</el-button>
				</el-col>
			</el-row>

			<template #reference>
				<el-input
					v-model="name"
					placeholder="请选择"
					clearable
					@click="open"
					@input="onChange"
				/>
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { iconList } from "/$/base";

export default defineComponent({
	name: "cl-menu-icons",

	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 是否可见
		const visible = ref<boolean>(false);

		// 图标列表
		const list = ref<any[]>(iconList());

		// 已选图标
		const name = ref<string>(props.modelValue);

		watch(
			() => props.modelValue,
			(val) => {
				name.value = val;
			}
		);

		function open() {
			visible.value = true;
		}

		function close() {
			visible.value = false;
		}

		function onChange(val: string) {
			emit("update:modelValue", val);
			close();
		}

		return {
			name,
			list,
			visible,
			open,
			close,
			onChange
		};
	}
});
</script>

.
<style lang="scss">
.cl-menu-icons {
	max-width: 90%;
	box-sizing: border-box;

	.list {
		display: flex;
		flex-wrap: wrap;
		height: 250px;
	}

	.el-button {
		margin-bottom: 10px;
		height: 40px;
		width: 100%;
		padding: 0;

		.icon-svg {
			font-size: 18px;
			color: #444;
		}
	}
}
</style>
