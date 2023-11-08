<script setup lang="ts">
import LeftMenu from '../components/layoutComponents/LeftMenu.vue';
</script>

<template>
	<nav class="navbar navbar-expand-lg">
		<a class="navbar-brand app-logo" href="#">
			<img src="@/assets/img/logo.png" class="d-inline-block align-middle" alt="">
		</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
			<ul class="navbar-nav align-items-center">
				<li class="nav-item">
					<a class="nav-link" href="#">
						<div class="icon-btn">
							<font-awesome-icon :icon="['fas', 'cog']" />
						</div>
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">
						<div class="icon-btn">
							<font-awesome-icon :icon="['fas', 'user']" />
						</div>
					</a>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle  d-flex align-items-center" href="#" id="navbarDropdown" role="button"
						data-bs-toggle="dropdown" aria-expanded="false">
						<span class="d-flex flex-column">
							<span class="fw-bold">Vignesh</span>
							<span class="small text-muted">Administrator</span>
						</span>
					</a>
					<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
						<li><a class="dropdown-item" href="#" @click="$router.push({ name: 'home' })">Logout</a></li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
	<main class="main-section">
		<LeftMenu />
		<div class="content-section h-100">
			<slot></slot>
		</div>
	</main>
</template>